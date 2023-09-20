import vscode from 'vscode';

import { GeneralComment } from '@/provider/TreeItems/GeneralComment.js';
import { Task } from './TreeItems/Task.js';

export class GeneralCommentsProvider {  
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.comments = [];
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
        items.push(new Task(comment));
        return;
      }

      items.push(new GeneralComment(comment));
    });

    return items;
	}
}
