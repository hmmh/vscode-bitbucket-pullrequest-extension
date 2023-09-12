import vscode from 'vscode';
import setReady from '../lib/setReady.js';

/**
 * Prompts the user to enter their Bitbucket token and stores it in the extension's secrets.
 * @param {vscode.ExtensionContext} context - The extension context.
 * @returns {Promise<void>} - A Promise that resolves when the token is stored.
 */
export default async function authenticateWithToken(context) {
  const token = await vscode.window.showInputBox({
    prompt: 'Please enter your token',
    placeHolder: 'Token'
  });

  await context.secrets.store('bitbucket-pullrequest-tasks.token', token);

  await setReady(context);

  vscode.window.showInformationMessage('Credentials to Bitbucket saved!');
}