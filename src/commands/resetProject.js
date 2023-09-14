import vscode from 'vscode';

import { SECRET_KEYS, CONTEXT_KEYS } from '@/config/variables.js';

export default async function resetProject(context) {
  const secretPromises = Object.values(SECRET_KEYS).map((key) => {
    return context.secrets.delete(key);
  });

  const contextPromises = Object.values(CONTEXT_KEYS).map((key) => {
    return context.workspaceState.update(key, null);
  });

  await Promise.all([...secretPromises, ...contextPromises]);

  vscode.commands.executeCommand('setContext', CONTEXT_KEYS.ready, false);
  vscode.commands.executeCommand('setContext', CONTEXT_KEYS.prLoaded, false);    

  vscode.window.showInformationMessage('Extension settings resetted!');
}