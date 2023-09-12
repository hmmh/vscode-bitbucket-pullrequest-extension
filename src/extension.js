import vscode from 'vscode';

// commands
import authenticate from './commands/authenticate.js';
import authenticateWithToken from './commands/authenticateWithToken.js';
import setupProject from './commands/setupProject.js';
import setHostURL from './commands/setHostURL.js';
import createPR from './commands/createPR.js';
import goToComment from './commands/goToComment.js';

import { initTasksView } from './views/tasksViewInitializer.js';
import { CommentsProvider } from './provider/CommentsProvider.js';
import { GeneralCommentsProvider } from './provider/GeneralCommentsProvider.js';
import PullRequest from './lib/PullRequest.js';
import Comments from './lib/Comments.js';

async function initPullRequests(context, tasksView, commentsProvider, generalCommentsProvider) {
	const comments = new Comments(context);
	const pr = new PullRequest(context, () => {
		tasksView.provider.updateData(pr.tasks);
		commentsProvider.updateData(pr.comments);
		generalCommentsProvider.updateData(pr.generalComments);
	
		comments.setComments([
			...pr.tasks,
			...pr.comments
		]);
	});
	tasksView.setPR(pr);
	await pr.loaded;
	await pr.loadComments();

	return pr;
}

function checkSetup(context) {
	const isReady = context.workspaceState.get('bitbucket-pullrequest-tasks.ready');
	vscode.commands.executeCommand('setContext', 'bitbucket-pullrequest-tasks.ready', isReady);
}

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	checkSetup(context);

	const tasksView = initTasksView();
	const commentsProvider = new CommentsProvider();
	const generalCommentsProvider = new GeneralCommentsProvider();
	const pr = initPullRequests(context, tasksView, commentsProvider, generalCommentsProvider);

	vscode.window.registerTreeDataProvider('bitbucket-pullrequest-comments-list', commentsProvider);
	vscode.window.registerTreeDataProvider('bitbucket-pullrequest-general-comments-list', generalCommentsProvider);
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.goToComment', (comment) => goToComment(comment, context)));

	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.auth', () => authenticate(context)));
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.authWithToken', () => authenticateWithToken(context)));
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.setupProject', () => setupProject(context)));
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.setHostURL', () => setHostURL(context)));
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.createPR', () => createPR(context)));
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.reloadComments', async () => {
		const pull = await pr
		await pull.loadComments();
		pull.branchChangeCallback();
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}