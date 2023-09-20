import vscode from 'vscode';

import { COMMAND_KEYS, COMMENT_TYPES } from '@/config/variables.js';

export class Task extends vscode.TreeItem {
  constructor(task) {
    super(task.text, vscode.TreeItemCollapsibleState.None);

    this.task = task;
    this.description = task.author.displayName;
    this.contextValue = COMMENT_TYPES.task;

    if (this.task?.anchor?.line) {
      this.command = {
        command: COMMAND_KEYS.goToComment,
        title: 'Go to task',
        arguments: [task]
      };
    }

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
