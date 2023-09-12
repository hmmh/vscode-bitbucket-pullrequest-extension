import vscode from 'vscode';

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

  setPR(pr) {
    this.pr = pr;
  }

  handleCheckboxClick(e) {
    const {items} = e;
    items.forEach(async (item) => {
      const task = item[0];
      const res = await this.pr.toggleTaskState(task.task);
      task.updateTask(res);
    });
  }
} 