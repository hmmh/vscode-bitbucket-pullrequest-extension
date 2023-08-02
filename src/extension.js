import vscode from 'vscode';
import path from 'path';

import authenticate from './commands/authenticate.js';
import setupProject from './commands/setupProject.js';
// import getTasks from './commands/getTasks.js';
import { TasksProvider } from './provider/TaskProvider.js';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	const tasksProvider = new TasksProvider(context);
	vscode.window.registerTreeDataProvider('bitbucket-pullrequest-tasks-list', tasksProvider);
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.goToTask', async (file) => {
		const workspace = vscode.workspace.workspaceFolders[0].uri.path;
		const uri = vscode.Uri.parse(file);
		const filePath = path.join(workspace, uri.path);
		let doc = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(doc, { preview: false });
	}));

	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.auth', () => authenticate(context)));
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.setupProject', () => setupProject(context)));
	// context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.getTasks', () => getTasks(context)));
}

// This method is called when your extension is deactivated
export function deactivate() {}