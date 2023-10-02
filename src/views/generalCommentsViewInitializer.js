import { GeneralCommentsProvider } from '../provider/GeneralCommentsProvider.js';
import TasksView from './TasksView.js';

import { TREEVIEW_KEYS } from '@/config/variables.js';

/**
 * Initializes the general comments view.
 * @param {any} context - The context object.
 * @returns {TasksView} The initialized general comments view.
 */
export function initGeneralCommentsView(context) {
  const view = new TasksView(new GeneralCommentsProvider(context), TREEVIEW_KEYS.generalComments);

  return view;
}