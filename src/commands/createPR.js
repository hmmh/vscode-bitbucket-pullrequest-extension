import vscode from 'vscode';

import { CONTEXT_KEYS } from '@/config/variables.js';

export default function createPR(context) {
  const hostURL = context.workspaceState.get(CONTEXT_KEYS.hostURL);
  const project = context.workspaceState.get(CONTEXT_KEYS.project);
  const repo = context.workspaceState.get(CONTEXT_KEYS.repository);

  const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
  const gitApi = gitExtension.getAPI(1);
  const repository = gitApi.repositories[0];
  const branchName = repository.state.HEAD.name;

  vscode.env.openExternal(vscode.Uri.parse(`${hostURL}/projects/${project}/repos/${repo}/pull-requests?create&sourceBranch=${branchName}`));
}