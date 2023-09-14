import vscode from 'vscode';
import setReady from '@/lib/setReady.js';

import { CONTEXT_KEYS } from '@/config/variables.js';

import setHostURL from '@/commands/setHostURL.js';

/**
 * Prompts the user to enter the name of the current Bitbucket project and repository,
 * saves the values in the workspace state, and displays a success message.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
export default async function setupProject(context) {
  await setHostURL(context);

  const projectVal = context.workspaceState.get(CONTEXT_KEYS.project);
  const repoVal = context.workspaceState.get(CONTEXT_KEYS.repository);

  const project = await vscode.window.showInputBox({
    prompt: 'Please enter the name of the current Bitbucket project',
    value: projectVal || '',
    placeHolder: 'Project'
  });

  const repository = await vscode.window.showInputBox({
    prompt: 'Please enter the name of the current repository',
    value: repoVal || '',
    placeHolder: 'Repository'
  });

  await context.workspaceState.update(CONTEXT_KEYS.project, project);
  await context.workspaceState.update(CONTEXT_KEYS.repository, repository);

  await setReady(context);

  vscode.window.showInformationMessage('Bitbucket project set up!');
}