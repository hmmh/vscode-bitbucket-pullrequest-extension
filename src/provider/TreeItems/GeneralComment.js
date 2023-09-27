import vscode from 'vscode';

import { COMMENT_TYPES } from '@/config/variables.js';

import { getTooltipMarkdown, stripMarkdown } from '@/utils/markdown.js';

export class GeneralComment extends vscode.TreeItem {
  constructor(comment, hostURL) {
    super(stripMarkdown(comment.text), vscode.TreeItemCollapsibleState.None);

    this.hostURL = hostURL;

    this.description = comment.author.displayName;
    this.contextValue = COMMENT_TYPES.generalComment;
    this.tooltip = getTooltipMarkdown(comment, this.hostURL);
  }
}