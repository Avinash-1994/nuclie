
/**
 * Nuclie VS Code Client Entry
 * Day 18: VS Code LSP Extension Lock
 */

import * as vscode from 'vscode';
import * as path from 'path';

// Mock types since we don't have @types/vscode installed in this environment
// In production, this uses real types.
type ExtensionContext = any;
type LanguageClient = any;

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    console.log('Nuclie Elite DX Active');

    // 1. Register Commands
    context.subscriptions.push(vscode.commands.registerCommand('nuclie.build', () => {
        runTerminalCommand('nuclie build');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('nuclie.dev', () => {
        runTerminalCommand('nuclie dev');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('nuclie.visualize', () => {
        runTerminalCommand('nuclie visualize');
        vscode.window.showInformationMessage('Opening Bundle Visualizer...');
    }));

    // 2. Start Language Server
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));

    // Config: Client/Server (Stubbed)
    // client = new LanguageClient('nuclie', 'Nuclie LSP', { run: { module: serverModule }, debug: { ... } }, { ... });
    // client.start();
}

function runTerminalCommand(cmd: string) {
    const term = vscode.window.createTerminal('Nuclie');
    term.show();
    term.sendText(cmd);
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
