import vscode from 'vscode';

import { COMMAND_KEYS, COMMENT_TYPES } from '@/config/variables.js';

import { getTooltipMarkdown, stripMarkdown } from '@/utils/markdown.js';

export class Comment extends vscode.TreeItem {
  constructor(comment, hostURL) {
    super(stripMarkdown(comment.text), vscode.TreeItemCollapsibleState.None);

    this.hostURL = hostURL;
    this.description = comment.author.displayName;
    this.contextValue = COMMENT_TYPES.comment;
    this.tooltip = getTooltipMarkdown(comment, this.hostURL);

    this.command = {
      command: COMMAND_KEYS.goToComment,
      title: 'Go to task',
      arguments: [comment]
    };
  }
}