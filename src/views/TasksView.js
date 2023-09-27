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

  updateData(comments) {
    this.comments = comments;
    this.provider.updateData(comments);
    this.tasksView.badge = { 
      value: comments.filter((comment) => comment.severity === 'BLOCKER' && comment.state === 'OPEN').length,
    };
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