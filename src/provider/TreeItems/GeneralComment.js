import vscode from 'vscode';

import { COMMENT_TYPES } from '@/config/variables.js';

import { getCommentMarkdown } from '@/utils/markdown.js';

export class GeneralComment extends vscode.TreeItem {
  constructor(comment, hostURL) {
    super(comment.text, vscode.TreeItemCollapsibleState.None);

    this.hostURL = hostURL;

    this.description = comment.author.displayName;
    this.contextValue = COMMENT_TYPES.generalComment;
    this.tooltip = getCommentMarkdown(comment, this.hostURL);
  }
}