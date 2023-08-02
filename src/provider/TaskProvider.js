import vscode from 'vscode';
import path from 'path';

import PullRequest from '../lib/PullRequest';

export class TasksProvider {  
  constructor(context) {
    this.context = context;
    this.pullRequest = new PullRequest(context, this.refresh.bind(this));
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
	}

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
		return element;
	}

	async getChildren() {
    await this.pullRequest.loaded;
    const tasks = await this.pullRequest.getTasks();
    const items = [];

    tasks.forEach(task => {
      items.push(new Task(task));
    });

    return items;
	}
}

export class Task extends vscode.TreeItem {
  constructor(task) {
    const label = `${task.properties.diffAnchorPath}`;
    super(label, vscode.TreeItemCollapsibleState.None);
    this.icon = task.state === 'RESOLVED' ? 'checkbox--checked.svg' : 'checkbox--unchecked.svg';

    this.iconPath = {
      light: path.join(__filename, '..', '..', 'resources', 'light', this.icon),
      dark: path.join(__filename, '..', '..', 'resources', 'dark', this.icon)
    };

    this.command = {
      command: 'bitbucket-pullrequest-tasks.goToTask',
      title: 'Go to task',
      arguments: [task.properties.diffAnchorPath]
    };
  }
}
