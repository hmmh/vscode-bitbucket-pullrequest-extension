import vscode from 'vscode';

import { CONTEXT_KEYS } from '@/config/variables.js';

export default async function setHostURL(context) {
  let oldHostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);

  if (!oldHostURL) {
    const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
    const gitApi = gitExtension.getAPI(1);
    const repository = gitApi.repositories[0];
    const remoteUrl = repository.state.remotes[0].fetchUrl.replace('ssh://', 'https://');
    oldHostURL = `https://${(new URL(remoteUrl)).hostname}`;
  }

  const hostURL = await vscode.window.showInputBox({
    prompt: 'Please enter the host url to your Bitbucket server',
    value: oldHostURL || '',
    placeHolder: 'https://your.bitbucket.server'
  });

  await context.workspaceState.update(CONTEXT_KEYS.hostURL, hostURL);

  vscode.window.showInformationMessage('Bitbucket server url saved!');
}