import vscode from 'vscode';

import { File } from './TreeItems/File.js';
import { Task } from './TreeItems/Task.js';

export class TasksProvider {  
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;

    this.files = {};
	}

  updateData(tasks) {
    if (tasks === undefined) return;
    this.files = {};
    
    tasks.forEach(task => {
      if (!this.files[task.anchor.path]) {
        this.files[task.anchor.path] = [];
      }

      this.files[task.anchor.path].push(task);
    });

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

    Object.entries(this.files).forEach(([filePath, tasks]) => {
      items.push(new File(filePath, tasks, Task));
    });

    return items;
	}
}
