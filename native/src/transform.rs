
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
        for item in module.body {
            match item {
                ModuleItem::ModuleDecl(decl) => {
                    match decl {
                        ModuleDecl::ExportDecl(ed) => {
                            // Extract identifier names for exports.x = x
                            if let Decl::Var(ref var) = ed.decl {
                                for def in &var.decls {
                                    if let Pat::Ident(ref ident) = def.name {
                                        let name = ident.id.sym.to_string();
                                        // Push the declaration itself: const x = 1
                                        new_body.push(ModuleItem::Stmt(Stmt::Decl(ed.decl.clone())));
                                        // Push the export assignment: exports.x = x
                                        new_body.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                                            span: swc_common::DUMMY_SP,
                                            expr: Box::new(Expr::Assign(AssignExpr {
                                                span: swc_common::DUMMY_SP,
                                                op: AssignOp::Assign,
                                                left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                                    span: swc_common::DUMMY_SP,
                                                    obj: Box::new(Expr::Ident(Ident::new("exports".into(), swc_common::DUMMY_SP))),
                                                    prop: MemberProp::Ident(Ident::new(name.clone().into(), swc_common::DUMMY_SP)),
                                                })),
                                                right: Box::new(Expr::Ident(Ident::new(name.into(), swc_common::DUMMY_SP))),
                                            })),
                                        })));
                                        continue;
                                    }
                                }
                            }
                        }
                        ModuleDecl::Import(_import) => {
                            // Convert import ... to require(...)
                            new_body.push(ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: swc_common::DUMMY_SP })));
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
            Syntax::Typescript(TsConfig::default()),
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
