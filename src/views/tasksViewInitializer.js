import { TasksProvider } from '../provider/TasksProvider.js';
import TasksView from './TasksView.js';

import { TREEVIEW_KEYS } from '@/config/variables.js';

export function initTasksView(context) {
  const view = new TasksView(new TasksProvider(context), TREEVIEW_KEYS.tasks);

  return view;
}