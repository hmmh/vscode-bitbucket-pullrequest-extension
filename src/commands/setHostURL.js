import vscode from 'vscode';

import { CONTEXT_KEYS } from '@/config/variables.js';

export default async function setHostURL(context) {
  const oldHostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);

  const hostURL = await vscode.window.showInputBox({
    prompt: 'Please enter the host url to your Bitbucket server',
    value: oldHostURL || '',
    placeHolder: 'https://your.bitbucket.server'
  });

  await context.workspaceState.update(CONTEXT_KEYS.hostURL, hostURL);

  vscode.window.showInformationMessage('Bitbucket server url saved!');
}