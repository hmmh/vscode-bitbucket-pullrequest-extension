import vscode from 'vscode';

// commands
import authenticate from './commands/authenticate.js';
import authenticateWithToken from './commands/authenticateWithToken.js';
import setupProject from './commands/setupProject.js';
import goToComment from './commands/goToComment.js';

import { TasksProvider } from './provider/TasksProvider.js';
import { CommentsProvider } from './provider/CommentsProvider.js';
import { GeneralCommentsProvider } from './provider/GeneralCommentsProvider.js';
import PullRequest from './lib/PullRequest.js';
import Comments from './lib/Comments.js';

async function initPullRequests(context, tasksProvider, commentsProvider, generalCommentsProvider) {
	const pr = new PullRequest(context, () => {});
	await pr.loaded;
	await pr.loadComments();

	tasksProvider.updateData(pr.tasks);
	commentsProvider.updateData(pr.comments);
	generalCommentsProvider.updateData(pr.generalComments);

	const comments = new Comments(context);
	comments.setComments([
		...pr.tasks,
		...pr.comments
	]);
}

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	const tasksProvider = new TasksProvider();
	const commentsProvider = new CommentsProvider();
	const generalCommentsProvider = new GeneralCommentsProvider();
	initPullRequests(context, tasksProvider, commentsProvider, generalCommentsProvider);

	vscode.window.registerTreeDataProvider('bitbucket-pullrequest-tasks-list', tasksProvider);
	vscode.window.registerTreeDataProvider('bitbucket-pullrequest-comments-list', commentsProvider);
	vscode.window.registerTreeDataProvider('bitbucket-pullrequest-general-comments-list', generalCommentsProvider);
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.goToComment', (comment) => goToComment(comment, context)));

	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.auth', () => authenticate(context)));
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.authWithToken', () => authenticateWithToken(context)));
	context.subscriptions.push(vscode.commands.registerCommand('bitbucket-pullrequest-tasks.setupProject', () => setupProject(context)));
}

// This method is called when your extension is deactivated
export function deactivate() {}