import vscode from 'vscode';

export default async function setHostURL(context) {
  const oldHostURL = context.workspaceState.get('bitbucket-pullrequest-tasks.hostURL');

  const hostURL = await vscode.window.showInputBox({
    prompt: 'Please enter the host url to your Bitbucket server',
    value: oldHostURL || '',
    placeHolder: 'https://your.bitbucket.server'
  });

  await context.workspaceState.update('bitbucket-pullrequest-tasks.hostURL', hostURL);

  vscode.window.showInformationMessage('Bitbucket server url saved!');
}