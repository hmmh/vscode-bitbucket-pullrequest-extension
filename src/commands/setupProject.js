import vscode from 'vscode';

export default async function setupProject(context) {
  const projectVal = context.workspaceState.get('bitbucket-pullrequest-tasks.project');
  const repoVal = context.workspaceState.get('bitbucket-pullrequest-tasks.repository');

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

  await context.workspaceState.update('bitbucket-pullrequest-tasks.project', project);
  await context.workspaceState.update('bitbucket-pullrequest-tasks.repository', repository);

  vscode.window.showInformationMessage('Bitbucket project set up!');
}