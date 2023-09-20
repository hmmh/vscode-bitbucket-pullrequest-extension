import { GeneralCommentsProvider } from '../provider/GeneralCommentsProvider.js';
import TasksView from './TasksView.js';

import { TREEVIEW_KEYS } from '@/config/variables.js';

export function initGeneralCommentsView() {
  const view = new TasksView(new GeneralCommentsProvider(), TREEVIEW_KEYS.generalComments);

  return view;
}