import vscode from 'vscode';
import BitBucketApiConnector from './BitBucketApiConnector.js';

export default class PullRequest {
  constructor(context, branchChangeCallback) {
    this.context = context;
    this.branchChangeCallback = branchChangeCallback;
    this.loaded = new Promise((resolve) => {
      this.setLoaded = resolve;
    });
    this.loadGitRepository();
  }

  loadGitRepository() {
    const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
    this.gitApi = gitExtension.getAPI(1);
    this.gitApi.onDidChangeState(async () => {
      this.repository = this.gitApi.repositories[0];
      
      this.repository.state.onDidChange(() => {
        this.load();
        this.branchChangeCallback();
      });
    });
  }

  async load() {
    if (!this.connector) await this.connectToBitBucket();
    this.branchName = this.repository.state.HEAD.name;
    this.pullRequest = await this.getPullRequest();

    if (!this.pullRequest) return;
    
    this.setLoaded();
  }

  async connectToBitBucket() {
    const username = await this.context.secrets.get('bitbucket-pullrequest-tasks.username');
    const password = await this.context.secrets.get('bitbucket-pullrequest-tasks.password');
    const project = this.context.workspaceState.get('bitbucket-pullrequest-tasks.project');
    const repo = this.context.workspaceState.get('bitbucket-pullrequest-tasks.repository');
    
    if (!project || !repo) return false;

    this.connector = new BitBucketApiConnector(project, repo, username, password);
  }
  
  async getPullRequest() {
    return await this.connector.getPullRequestByBranch(this.branchName);
  }

  async getTasks() {
    const {values} = await this.connector.getPullRequestTasks(this.pullRequest.id);

    return values;
  }
}