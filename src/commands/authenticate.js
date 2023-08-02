import vscode from 'vscode';

export default async function authenticate(context) {
  const username = await vscode.window.showInputBox({
    prompt: 'Please enter your username',
    placeHolder: 'Name'
  });

  const password = await vscode.window.showInputBox({
    prompt: 'Please enter your password',
    password: true,
    placeHolder: 'Password'
  });

  await context.secrets.store('bitbucket-pullrequest-tasks.username', username);
  await context.secrets.store('bitbucket-pullrequest-tasks.password', password);

  vscode.window.showInformationMessage('Credentials to Bitbucket saved!');
}