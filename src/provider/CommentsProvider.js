import vscode from 'vscode';

import { CONTEXT_KEYS } from '@/config/variables.js';

import { File } from './TreeItems/File.js';
import { Comment } from './TreeItems/Comment.js';

import { groupCommentsByFiles } from '@/utils/groupCommentsByFiles.js';

export class CommentsProvider {  
  constructor(context) {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.files = new Map();

    this.hostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);
	}

  /**
   * Groups comments by files and refreshes the view.
   * @param {Array} comments - The comments to update the data with.
   */
  updateData(comments) {
    if (comments === undefined) return;
    this.files = groupCommentsByFiles(comments);

    this.refresh();
  }

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
		return element;
	}

	async getChildren(element) {
    if (element) {
      return await element.getChildren();
    }
    const items = [];

    this.files.forEach((comments, filePath) => {
      items.push(new File(filePath, comments, Comment, this.hostURL));
    });

    return items;
	}
}