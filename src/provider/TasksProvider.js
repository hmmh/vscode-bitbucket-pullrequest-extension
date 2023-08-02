import vscode from 'vscode';
import path from 'path';

export class TasksProvider {  
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.files = {};
	}

  updateData(tasks) {
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
    this.icon = task.state === 'RESOLVED' ? 'checkbox--checked.svg' : 'checkbox--unchecked.svg';

    this.iconPath = {
      light: path.join(__filename, '..', '..', 'resources', 'light', this.icon),
      dark: path.join(__filename, '..', '..', 'resources', 'dark', this.icon)
    };

    this.command = {
      command: 'bitbucket-pullrequest-tasks.goToComment',
      title: 'Go to task',
      arguments: [task]
    };
  }
}
