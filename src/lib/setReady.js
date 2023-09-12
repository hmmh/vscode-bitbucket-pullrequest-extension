import vscode from 'vscode';

export default async function setReady(context) {
  const username = await context.secrets.get('bitbucket-pullrequest-tasks.username');
  const password = await context.secrets.get('bitbucket-pullrequest-tasks.password');
  const token = await context.secrets.get('bitbucket-pullrequest-tasks.token');
  const project = context.workspaceState.get('bitbucket-pullrequest-tasks.project');
  const repo = context.workspaceState.get('bitbucket-pullrequest-tasks.repository');

  if (((username && password) || token) && (project && repo)) {
    context.workspaceState.update('bitbucket-pullrequest-tasks.ready', true);
  	vscode.commands.executeCommand('setContext', 'bitbucket-pullrequest-tasks.ready', true);
  }
}