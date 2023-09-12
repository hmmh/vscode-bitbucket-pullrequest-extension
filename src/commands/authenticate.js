import vscode from 'vscode';
import setReady from '../lib/setReady.js';

/**
 * Prompts the user to enter their Bitbucket username and password, and stores them securely in the extension's context.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
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

  await setReady(context);

  vscode.window.showInformationMessage('Credentials to Bitbucket saved!');
}