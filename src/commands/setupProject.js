import vscode from 'vscode';
import setReady from '@/utils/setReady.js';

import { CONTEXT_KEYS } from '@/config/variables.js';

import setHostURL from '@/commands/setHostURL.js';

/**
 * Prompts the user to enter the name of the current Bitbucket project and repository,
 * saves the values in the workspace state, and displays a success message.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
export default async function setupProject(context) {
  await setHostURL(context);

  let projectVal = context.workspaceState.get(CONTEXT_KEYS.project);
  let repoVal = context.workspaceState.get(CONTEXT_KEYS.repository);

  if (!projectVal || !repoVal) {
    const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
    const gitApi = gitExtension.getAPI(1);
    const repository = gitApi.repositories[0];
    const remoteUrl = repository.state.remotes[0].fetchUrl.replace('ssh://', 'https://').replace('.git', '');
    const url = new URL(remoteUrl);
    const path = url.pathname.split('/');

    if (!projectVal) projectVal = path[1];
    if (!repoVal) repoVal = path[2];
  }

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