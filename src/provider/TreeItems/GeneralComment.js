import vscode from 'vscode';

import { COMMENT_TYPES } from '@/config/variables.js';

export class GeneralComment extends vscode.TreeItem {
  constructor(comment) {
    super(comment.text, vscode.TreeItemCollapsibleState.None);

    this.description = comment.author.displayName;
    this.contextValue = COMMENT_TYPES.generalComment;
  }
}