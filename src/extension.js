import vscode from 'vscode';

// config
import {
	COMMAND_KEYS,
	CONTEXT_KEYS
} from './config/variables.js';

// lib
import init from '@/lib/init.js';
import { pr } from '@/lib/PullRequest.js';

// commands
import authenticate from '@/commands/authenticate.js';
import authenticateWithToken from '@/commands/authenticateWithToken.js';
import setupProject from '@/commands/setupProject.js';
import resetProject from '@/commands/resetProject.js';
import setHostURL from '@/commands/setHostURL.js';
import createPR from '@/commands/createPR.js';
import goToComment from '@/commands/goToComment.js';

function checkSetup(context) {
	const isReady = context.workspaceState.get(CONTEXT_KEYS.ready);

	vscode.commands.executeCommand('setContext', CONTEXT_KEYS.ready, isReady);

	return isReady;
}

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	const isReady = checkSetup(context);
	pr.setContext(context);

	if (isReady) init(context);

	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_KEYS.goToComment, (comment) => goToComment(comment, context)));
	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_KEYS.auth, () => authenticate(context)));
	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_KEYS.authWithToken, () => authenticateWithToken(context)));
	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_KEYS.setupProject, () => setupProject(context)));
	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_KEYS.resetProject, () => resetProject(context)));
	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_KEYS.setHostURL, () => setHostURL(context)));
	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_KEYS.createPR, () => createPR(context)));
	context.subscriptions.push(vscode.commands.registerCommand(COMMAND_KEYS.reloadComments, async () => {
		pr.loadComments();
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}