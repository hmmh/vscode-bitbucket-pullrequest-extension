import vscode from 'vscode';

import { CONTEXT_KEYS } from '@/config/variables.js';

import { GeneralComment } from '@/provider/TreeItems/GeneralComment.js';
import { Task } from './TreeItems/Task.js';

export class GeneralCommentsProvider {  
  constructor(context) {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.comments = [];

    this.hostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);
	}

  updateData(comments) {
    if (comments === undefined) return;

    this.comments = comments;

    this.refresh();
  }

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
		return element;
	}

	async getChildren() {
    const items = [];

    this.comments.forEach((comment) => {
      if (comment.severity === 'BLOCKER') {
        items.push(new Task(comment, this.hostURL));
        return;
      }

      items.push(new GeneralComment(comment, this.hostURL));
    });

    return items;
	}
}
