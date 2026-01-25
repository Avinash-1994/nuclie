import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist-rspack'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'ecmascript',
                                jsx: true
                            },
                            transform: {
                                react: {
                                    runtime: 'automatic'
                                }
                            }
                        }
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new rspack.HtmlRspackPlugin({
            template: './index.html'
        })
    ]
});
