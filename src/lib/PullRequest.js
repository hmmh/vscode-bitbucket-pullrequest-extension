import vscode from 'vscode';
import BitBucketApiConnector from './BitBucketApiConnector.js';


/**
 * Represents a pull request
 */
export default class PullRequest {
  constructor(context, branchChangeCallback) {
    this.context = context;
    this.branchChangeCallback = branchChangeCallback;
    this.loaded = new Promise((resolve) => {
      this.setLoaded = resolve;
    });
    this.loadGitRepository();

    this.generalComments = [];
    this.comments = [];
    this.tasks = [];
  }

  /**
   * Loads the Git repository.
   * When the repository state changes, the `load` method is called and the `branchChangeCallback` is triggered.
   */
  loadGitRepository() {
    const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
    this.gitApi = gitExtension.getAPI(1);
    this.gitApi.onDidChangeState(async () => {
      this.repository = this.gitApi.repositories[0];
      
      this.repository.state.onDidChange(async () => {
        await this.load();
        await this.loadComments();
        this.branchChangeCallback();
      });
    });
  }

  /**
   * Loads the pull request associated with the current branch.
   * If the pull request cannot be found, the method returns early.
   * Otherwise, the `loaded` promise is resolved.
   */
  async load() {
    if (!this.connector) await this.connectToBitBucket();
    this.branchName = this.repository.state.HEAD.name;
    this.pullRequest = await this.getPullRequest();

    if (!this.pullRequest) return;

    vscode.commands.executeCommand('setContext', 'bitbucket-pullrequest-tasks.prLoaded', true);    
    this.setLoaded();
  }

  /**
   * Connects to BitBucket using the provided credentials and retrieves the project and repository information from the workspace state.
   * If the project or repository information is missing, the method returns false.
   * Otherwise, it creates a new instance of the BitBucketApiConnector class with the provided credentials.
   */
  async connectToBitBucket() {
    const username = await this.context.secrets.get('bitbucket-pullrequest-tasks.username');
    const password = await this.context.secrets.get('bitbucket-pullrequest-tasks.password');
    const token = await this.context.secrets.get('bitbucket-pullrequest-tasks.token');
    const hostURL = this.context.workspaceState.get('bitbucket-pullrequest-tasks.hostURL');
    const project = this.context.workspaceState.get('bitbucket-pullrequest-tasks.project');
    const repo = this.context.workspaceState.get('bitbucket-pullrequest-tasks.repository');

    if (!hostURL || !project || !repo) return false;
    
    this.connector = new BitBucketApiConnector(hostURL, project, repo, {
      username,
      password,
      token
    });
  }
  
  /**
   * Retrieves the pull request associated with the current branch from the BitBucket API.
   * If the pull request cannot be found, the method returns null.
   * @returns {Promise<Object|null>} A promise that resolves with the pull request object or null if it cannot be found.
   */
  async getPullRequest() {
    return await this.connector.getPullRequestByBranch(this.branchName);
  }

  /**
   * Loads the comments and tasks associated with the pull request.
   */
  async loadComments() {
    const {generalComments, comments, tasks} = await this.connector.getPullRequestComments(this.pullRequest.id);
    this.generalComments = generalComments;
    this.comments = comments;
    this.tasks = tasks;
  }

  async toggleTaskState(task) {
    return await this.connector.changeTaskState(this.pullRequest.id, task.id, task.version, task.state === 'OPEN');
  }
}