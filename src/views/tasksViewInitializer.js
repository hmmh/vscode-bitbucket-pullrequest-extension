import { TasksProvider } from '../provider/TasksProvider.js';
import TasksView from './TasksView.js';

import { TREEVIEW_KEYS } from '@/config/variables.js';

export function initTasksView() {
  const view = new TasksView(new TasksProvider(), TREEVIEW_KEYS.tasks);

  return view;
}