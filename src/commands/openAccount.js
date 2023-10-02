import vscode from 'vscode';

import { CONTEXT_KEYS } from '@/config/variables.js';

export default function openAccount(context) {
  const hostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);

  vscode.env.openExternal(vscode.Uri.parse(`${hostURL}/account`));
}