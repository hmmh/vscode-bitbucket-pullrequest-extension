import vscode from 'vscode';

import { CONTEXT_KEYS } from '@/config/variables.js';

import { File } from './TreeItems/File.js';
import { Task } from './TreeItems/Task.js';

import { groupCommentsByFiles } from '@/utils/groupCommentsByFiles.js';

export class TasksProvider {  
  constructor(context) {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;

    this.hostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);
    this.files = new Map();
	}

  updateData(tasks) {
    if (tasks === undefined) return;
    this.files = groupCommentsByFiles(tasks);

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

    this.files.forEach((tasks, filePath) => {
      items.push(new File(filePath, tasks, Task, this.hostURL));
    });

    return items;
	}
}
