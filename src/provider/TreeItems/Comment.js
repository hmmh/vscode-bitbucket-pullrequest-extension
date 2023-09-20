import vscode from 'vscode';

import { COMMAND_KEYS, COMMENT_TYPES } from '@/config/variables.js';

export class Comment extends vscode.TreeItem {
  constructor(comment) {
    super(comment.text, vscode.TreeItemCollapsibleState.None);

    this.description = comment.author.displayName;
    this.contextValue = COMMENT_TYPES.comment;

    this.command = {
      command: COMMAND_KEYS.goToComment,
      title: 'Go to task',
      arguments: [comment]
    };
  }
}