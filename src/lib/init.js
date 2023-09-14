import vscode from 'vscode';

import { TREEVIEW_KEYS } from '@/config/variables.js';

import { initTasksView } from '@/views/tasksViewInitializer.js';
import { CommentsProvider } from '@/provider/CommentsProvider.js';
import { GeneralCommentsProvider } from '@/provider/GeneralCommentsProvider.js';
import { pr } from '@/lib/PullRequest.js';
import Comments from '@/lib/Comments.js';

/**
 * Initializes the pull requests and updates the tasks, comments, and general comments providers.
 * @param {Object} context - The context object.
 * @param {Object} tasksView - The tasks view object.
 * @param {Object} commentsProvider - The comments provider object.
 * @param {Object} generalCommentsProvider - The general comments provider object.
 * @returns {Object} - The pull request object.
 */
async function initPullRequests(context, tasksView, commentsProvider, generalCommentsProvider) {
	const commentsInfo = new Comments(context);

	pr.subscribe(({tasks}) => tasksView.provider.updateData(tasks));
  pr.subscribe(({comments}) => commentsProvider.updateData(comments));
  pr.subscribe(({generalComments}) => generalCommentsProvider.updateData(generalComments));
  pr.subscribe(({tasks, comments}) => commentsInfo.setComments([
    ...tasks,
    ...comments
  ]));

	pr.loadGitRepository();
	await pr.loaded;
	await pr.loadComments();
}

export default async function init(context) {
  const tasksView = initTasksView();
	const commentsProvider = new CommentsProvider();
	const generalCommentsProvider = new GeneralCommentsProvider();

	initPullRequests(context, tasksView, commentsProvider, generalCommentsProvider);

	vscode.window.registerTreeDataProvider(TREEVIEW_KEYS.comments, commentsProvider);
	vscode.window.registerTreeDataProvider(TREEVIEW_KEYS.generalComments, generalCommentsProvider);
}