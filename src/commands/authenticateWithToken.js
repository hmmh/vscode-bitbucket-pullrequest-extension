import vscode from 'vscode';

export default async function authenticateWithToken(context) {
  const token = await vscode.window.showInputBox({
    prompt: 'Please enter your token',
    placeHolder: 'Token'
  });

  await context.secrets.store('bitbucket-pullrequest-tasks.token', token);

  vscode.window.showInformationMessage('Credentials to Bitbucket saved!');
}