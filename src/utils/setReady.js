import vscode from 'vscode';

import { CONTEXT_KEYS, SECRET_KEYS } from '@/config/variables.js';

import init from '@/utils/init.js';

export default async function setReady(context) {
  const username = await context.secrets.get(SECRET_KEYS.user);
  const password = await context.secrets.get(SECRET_KEYS.password);
  const token = await context.secrets.get(SECRET_KEYS.token);
  const project = context.workspaceState.get(CONTEXT_KEYS.project);
  const repo = context.workspaceState.get(CONTEXT_KEYS.repository);
  const hostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);

  if (hostURL && project && repo) {
    context.workspaceState.update(CONTEXT_KEYS.isProjectSetup, true);
  	vscode.commands.executeCommand('setContext', CONTEXT_KEYS.isProjectSetup, true);
  }

  if (((username && password) || token) && (project && repo)) {
    context.workspaceState.update(CONTEXT_KEYS.ready, true);
  	vscode.commands.executeCommand('setContext', CONTEXT_KEYS.ready, true);

    init(context);
  }
}