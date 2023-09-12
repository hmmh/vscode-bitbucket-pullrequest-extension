import { TasksProvider } from '../provider/TasksProvider.js';
import TasksView from './TasksView.js';

export function initTasksView() {
  const view = new TasksView(new TasksProvider(), 'bitbucket-pullrequest-tasks-list');

  return view;
}