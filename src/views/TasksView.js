import vscode from 'vscode';

import { pr } from '@/lib/PullRequest.js';

export default class TasksView {
  constructor(provider, treeViewKey) {
    this.provider = provider;
    this.tasksView = vscode.window.createTreeView(
      treeViewKey,
      {
        treeDataProvider: this.provider
      }
    );
    this.tasksView.onDidChangeCheckboxState(this.handleCheckboxClick.bind(this));
  }

  handleCheckboxClick(e) {
    const {items} = e;
    items.forEach(async (item) => {
      const task = item[0];
      const res = await pr.toggleTaskState(task.task);
      task.updateTask(res);
    });
  }
} 