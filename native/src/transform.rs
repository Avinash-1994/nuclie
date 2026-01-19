
use swc_common::{SourceMap, FileName, FilePathMapping, GLOBALS, Mark};
use swc_common::sync::Lrc;
use swc_core::ecma::parser::{Parser, StringInput, Syntax, TsConfig};
use swc_core::ecma::codegen::{Config, Emitter, text_writer::JsWriter};
use swc_core::ecma::visit::VisitMutWith;
use swc_core::ecma::minifier::{optimize, option::{MinifyOptions, ExtraOptions, TopLevelOptions}};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_transforms_base::hygiene::hygiene;
use swc_ecma_transforms_base::resolver;

pub fn transform_js(code: String, filename: String, minify_opts: bool) -> Result<String, String> {
    GLOBALS.set(&Default::default(), || {
        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Real(filename.into()), code);

        let mut parser = Parser::new(
            Syntax::Typescript(TsConfig {
                tsx: true,
                decorators: true,
                ..Default::default()
            }),
            StringInput::from(&*fm),
            None,
        );

        let mut module = parser.parse_module().map_err(|e| format!("Parser Error: {:?}", e))?;

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        module.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

        // 2. ESM Conversion (Nexxo Runtime Format)
        // Instead of stripping, we convert 'export' to 'exports' assignments
        // and 'import' to 'require' calls.
        use swc_core::ecma::ast::*;
        let mut new_body = vec![];

        // Helpers for generating CJS nodes
        let create_exports_assign = |name: String, expr: Box<Expr>| -> ModuleItem {
            ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                span: swc_common::DUMMY_SP,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: swc_common::DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                        span: swc_common::DUMMY_SP,
                        obj: Box::new(Expr::Ident(Ident::new("exports".into(), swc_common::DUMMY_SP))),
                        prop: MemberProp::Ident(Ident::new(name.into(), swc_common::DUMMY_SP)),
                    })),
                    right: expr,
                })),
            }))
        };

        for item in module.body {
            match item {
                ModuleItem::ModuleDecl(decl) => {
                    match decl {
                        ModuleDecl::ExportDecl(ed) => {
                            match ed.decl {
                                Decl::Var(var) => {
                                    new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(var.clone()))));
                                    for def in &var.decls {
                                        if let Pat::Ident(ident) = &def.name {
                                            let name = ident.sym.to_string();
                                            new_body.push(create_exports_assign(name.clone(), Box::new(Expr::Ident(Ident::new(name.into(), swc_common::DUMMY_SP)))));
                                        }
                                    }
                                }
                                Decl::Class(cls) => {
                                    let name = cls.ident.sym.to_string();
                                    new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(cls.clone()))));
                                    new_body.push(create_exports_assign(name.clone(), Box::new(Expr::Ident(Ident::new(name.into(), swc_common::DUMMY_SP)))));
                                }
                                Decl::Fn(f) => {
                                    let name = f.ident.sym.to_string();
                                    new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f.clone()))));
                                    new_body.push(create_exports_assign(name.clone(), Box::new(Expr::Ident(Ident::new(name.into(), swc_common::DUMMY_SP)))));
                                }
                                _ => {
                                    new_body.push(ModuleItem::Stmt(Stmt::Decl(ed.decl.clone())));
                                }
                            }
                        }
                        ModuleDecl::ExportDefaultDecl(edd) => {
                            match edd.decl {
                                DefaultDecl::Class(cls) => {
                                    let name = cls.ident.as_ref().map(|i| i.sym.to_string()).unwrap_or_else(|| "_default_class".to_string());
                                    new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                                        ident: Ident::new(name.clone().into(), swc_common::DUMMY_SP),
                                        class: cls.class,
                                        declare: false,
                                    }))));
                                    new_body.push(create_exports_assign("default".to_string(), Box::new(Expr::Ident(Ident::new(name.into(), swc_common::DUMMY_SP)))));
                                }
                                DefaultDecl::Fn(f) => {
                                    let name = f.ident.as_ref().map(|i| i.sym.to_string()).unwrap_or_else(|| "_default_fn".to_string());
                                    new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                                        ident: Ident::new(name.clone().into(), swc_common::DUMMY_SP),
                                        function: f.function,
                                        declare: false,
                                    }))));
                                    new_body.push(create_exports_assign("default".to_string(), Box::new(Expr::Ident(Ident::new(name.into(), swc_common::DUMMY_SP)))));
                                }
                                _ => {}
                            }
                        }
                        ModuleDecl::ExportDefaultExpr(ede) => {
                            new_body.push(create_exports_assign("default".to_string(), ede.expr));
                        }
                        ModuleDecl::Import(import) => {
                            let src = import.src.value.to_string();
                            let mut props = vec![];
                            let mut default_ident = None;
                            let mut namespace_ident = None;

                            for spec in &import.specifiers {
                                match spec {
                                    ImportSpecifier::Named(named) => {
                                        let local = named.local.sym.to_string();
                                        let imported = named.imported.as_ref().map(|i| match i {
                                            ModuleExportName::Ident(id) => id.sym.to_string(),
                                            ModuleExportName::Str(s) => s.value.to_string(),
                                        }).unwrap_or_else(|| local.clone());
                                        
                                        props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                                            key: PropName::Ident(Ident::new(imported.into(), swc_common::DUMMY_SP)),
                                            value: Box::new(Pat::Ident(BindingIdent {
                                                id: Ident::new(local.into(), swc_common::DUMMY_SP),
                                                type_ann: None,
                                            })),
                                        }));
                                    }
                                    ImportSpecifier::Default(d) => {
                                        default_ident = Some(d.local.sym.to_string());
                                    }
                                    ImportSpecifier::Namespace(ns) => {
                                        namespace_ident = Some(ns.local.sym.to_string());
                                    }
                                }
                            }

                            fn create_require(src: &str) -> Box<Expr> {
                                Box::new(Expr::Call(CallExpr {
                                    span: swc_common::DUMMY_SP,
                                    callee: Callee::Expr(Box::new(Expr::Ident(Ident::new("require".into(), swc_common::DUMMY_SP)))),
                                    args: vec![ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(Expr::Lit(Lit::Str(Str {
                                            span: swc_common::DUMMY_SP,
                                            value: src.into(),
                                            raw: None,
                                        }))),
                                    }],
                                    type_args: None,
                                }))
                            }

                            if let Some(ns) = namespace_ident {
                                new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                                    span: swc_common::DUMMY_SP,
                                    kind: VarDeclKind::Const,
                                    declare: false,
                                    decls: vec![VarDeclarator {
                                        span: swc_common::DUMMY_SP,
                                        name: Pat::Ident(BindingIdent { id: Ident::new(ns.into(), swc_common::DUMMY_SP), type_ann: None }),
                                        init: Some(create_require(&src)),
                                        definite: false,
                                    }],
                                })))));
                            } else if let Some(d) = default_ident {
                                new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                                    span: swc_common::DUMMY_SP,
                                    kind: VarDeclKind::Const,
                                    declare: false,
                                    decls: vec![VarDeclarator {
                                        span: swc_common::DUMMY_SP,
                                        name: Pat::Ident(BindingIdent { id: Ident::new(d.into(), swc_common::DUMMY_SP), type_ann: None }),
                                        init: Some(Box::new(Expr::Bin(BinExpr {
                                            span: swc_common::DUMMY_SP,
                                            op: BinaryOp::LogicalOr,
                                            left: Box::new(Expr::Member(MemberExpr {
                                                span: swc_common::DUMMY_SP,
                                                obj: create_require(&src),
                                                prop: MemberProp::Ident(Ident::new("default".into(), swc_common::DUMMY_SP)),
                                            })),
                                            right: create_require(&src),
                                        }))),
                                        definite: false,
                                    }],
                                })))));
                            } else if !props.is_empty() {
                                new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                                    span: swc_common::DUMMY_SP,
                                    kind: VarDeclKind::Const,
                                    declare: false,
                                    decls: vec![VarDeclarator {
                                        span: swc_common::DUMMY_SP,
                                        name: Pat::Object(ObjectPat { span: swc_common::DUMMY_SP, props, type_ann: None, optional: false }),
                                        init: Some(create_require(&src)),
                                        definite: false,
                                    }],
                                })))));
                            } else {
                                new_body.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                                    span: swc_common::DUMMY_SP,
                                    expr: create_require(&src),
                                })));
                            }
                        }
                        _ => {
                            new_body.push(ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: swc_common::DUMMY_SP })));
                        }
                    }
                }
                ModuleItem::Stmt(s) => new_body.push(ModuleItem::Stmt(s)),
            }
        }
        module.body = new_body;

        if minify_opts {
            let mut options = MinifyOptions::default();
            let mut compress = swc_core::ecma::minifier::option::CompressOptions::default();
            
            // In dev mode (handled by caller passing minify_opts=true), 
            // we should be careful about unused top-level functions
            compress.unused = false; // Disable unused elimination for top-level exports in this pass
            compress.dead_code = true;
            compress.top_level = Some(TopLevelOptions { functions: false });
            
            options.compress = Some(compress);
            options.mangle = Some(Default::default());
            
            module = optimize(
                module.into(),
                cm.clone(),
                None,
                None,
                &options,
                &ExtraOptions {
                    top_level_mark,
                    unresolved_mark,
                },
            ).expect_module();
        }

        module.visit_mut_with(&mut hygiene());
        module.visit_mut_with(&mut fixer(None));

        let mut buf = vec![];
        {
            let mut wr = JsWriter::new(cm.clone(), "", &mut buf, None);
            let mut cfg = Config::default();
            cfg.minify = true;
            cfg.omit_last_semi = true;
            let mut gen = Emitter {
                cfg,
                cm: cm.clone(),
                comments: None,
                wr: &mut wr,
            };
            gen.emit_module(&module).map_err(|e| format!("Codegen Error: {:?}", e))?;
        }

        String::from_utf8(buf).map_err(|e| format!("UTF8 Error: {:?}", e))
    })
}

pub fn minify_js(code: String) -> Result<String, String> {
    GLOBALS.set(&Default::default(), || {
        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Anon, code);

        let mut parser = Parser::new(
            Syntax::Typescript(TsConfig {
                tsx: true,
                decorators: true,
                ..Default::default()
            }),
            StringInput::from(&*fm),
            None,
        );

        let mut module = parser.parse_module().map_err(|e| format!("Parser Error (M): {:?}", e))?;

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        module.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

        let mut options = MinifyOptions::default();
        let mut compress = swc_core::ecma::minifier::option::CompressOptions::default();
        
        compress.unused = true;
        compress.dead_code = true;
        compress.join_vars = true;
        compress.collapse_vars = true;
        compress.reduce_vars = true;
        compress.drop_console = true;
        compress.top_level = Some(TopLevelOptions { functions: true });
        
        options.compress = Some(compress);
        options.mangle = Some(Default::default());
        options.rename = true;
        
        module = optimize(
            module.into(),
            cm.clone(),
            None,
            None,
            &options,
            &ExtraOptions {
                top_level_mark,
                unresolved_mark,
            },
        ).expect_module();

        module.visit_mut_with(&mut hygiene());
        module.visit_mut_with(&mut fixer(None));

        let mut buf = vec![];
        {
            let mut wr = JsWriter::new(cm.clone(), "", &mut buf, None);
            let mut cfg = Config::default();
            cfg.minify = true;
            cfg.omit_last_semi = true;
            let mut gen = Emitter {
                cfg,
                cm: cm.clone(),
                comments: None,
                wr: &mut wr,
            };
            gen.emit_module(&module).map_err(|e| format!("Codegen Error (M): {:?}", e))?;
        }

        String::from_utf8(buf).map_err(|e| format!("UTF8 Error: {:?}", e))
    })
}
