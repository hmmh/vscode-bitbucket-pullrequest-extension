import vscode from 'vscode';
import path from 'path';

import { COMMAND_KEYS } from '@/config/variables.js';

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
      items.push(new File(filePath, tasks));
    });

    return items;
	}
}

export class File extends vscode.TreeItem {
  constructor(filePath, tasks) {
    super(path.basename(filePath), vscode.TreeItemCollapsibleState.Collapsed);
    this.tasks = tasks;
  }

  async getChildren() {
    const items = [];

    this.tasks.forEach(task => {
      items.push(new Task(task));
    });

    return items;
	}
}

export class Task extends vscode.TreeItem {
  constructor(task) {
    super(task.text, vscode.TreeItemCollapsibleState.None);

    this.task = task;
    this.description = task.author.displayName;
    this.command = {
      command: COMMAND_KEYS.goToComment,
      title: 'Go to task',
      arguments: [task]
    };

    this.updateCheckboxState();
  }

  updateTask(task) {
    this.task = task;
    this.updateCheckboxState();
  }

  updateCheckboxState() {
    this.checkboxState = this.task.state === 'RESOLVED' 
      ? vscode.TreeItemCheckboxState.Checked
      : vscode.TreeItemCheckboxState.Unchecked;
  }
}
