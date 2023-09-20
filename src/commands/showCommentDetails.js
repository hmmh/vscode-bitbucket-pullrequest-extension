import vscode from 'vscode';

import { CONTEXT_KEYS, COMMENT_TYPES } from '@/config/variables.js';

import { comments } from '@/lib/Comments.js';
import { pr } from '@/lib/PullRequest.js';

import { Task } from '@/provider/TreeItems/Task.js';

function openComment(context, comment) {
  const hostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);
  const project = context.workspaceState.get(CONTEXT_KEYS.project);
  const repo = context.workspaceState.get(CONTEXT_KEYS.repository);

  vscode.env.openExternal(vscode.Uri.parse(`${hostURL}/projects/${project}/repos/${repo}/pull-requests/${pr.pullRequest.id}/overview?commentId=${comment.id}`));
}

function getCommentByLineNumber({lineNumber, uri}) {
  return comments.comments.find(comment => 
    uri.path.includes(comment.comment.anchor.path)
    && comment.comment.anchor.line === lineNumber
  )?.comment;
}

function getCommentActions(comment) {
  const actions = ['Answer'];

  if (comment.type === COMMENT_TYPES.task) {
    actions.unshift(`Mark as ${comment.state === 'RESOLVED' ? 'un' : ''}resolved`);
  }

  return actions;
}

export default async function showCommentDetails(context, e) {
  let comment;

  if (!(e instanceof Task)) comment = getCommentByLineNumber(e);
  else comment = e.task;

  const action = await vscode.window.showInformationMessage(
    `${comment.author.displayName}: ${comment.text}`,
    ...getCommentActions(comment)
  );

  if (action === 'Answer') {
    openComment(context, comment);
  } else if (['Mark as resolved', 'Mark as unresolved'].includes(action)) {
    pr.toggleTaskState(comment);
  }
}