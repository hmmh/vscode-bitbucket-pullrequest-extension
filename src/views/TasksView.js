import vscode from 'vscode';

import { pr } from '@/lib/PullRequest.js';

/**
 * Represents a view for displaying tasks in a tree view.
 */
export default class TasksView {
  /**
   * Creates a new instance of TasksView.
   * @param {TreeDataProvider} provider - The tree data provider to use for retrieving and updating tasks.
   * @param {string} treeViewKey - The unique key for the tree view.
   */
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

  /**
   * Updates the data displayed in the tree view.
   * @param {Array} comments - The comments to display as tasks.
   */
  updateData(comments) {
    this.comments = comments;
    this.provider.updateData(comments);

    const tasks = [
      ...pr.tasks,
      ...pr.generalComments
    ];

    this.tasksView.badge = { 
      value: tasks.filter((comment) => comment.severity === 'BLOCKER' && comment.state === 'OPEN').length,
    };
  }

  /**
   * Handles the click event for a checkbox in the tree view.
   * @param {CheckboxChangeEvent} e - The event object for the checkbox change.
   */
  handleCheckboxClick(e) {
    const {items} = e;
    items.forEach(async (item) => {
      const task = item[0];
      const res = await pr.toggleTaskState(task.task);
      task.updateTask(res);
    });
  }}

