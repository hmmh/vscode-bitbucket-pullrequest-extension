import vscode from 'vscode';
import BitBucketApiConnector from '@/lib/BitBucketApiConnector.js';

import { CONTEXT_KEYS, SECRET_KEYS, COMMENT_TYPES } from '@/config/variables.js';

/**
 * Represents a pull request
 */
class PullRequest {
  constructor() {
    this.loaded = new Promise((resolve) => {
      this.setLoaded = resolve;
    });

    this.generalComments = [];
    this.comments = [];
    this.tasks = [];
    this.subscribers = new Set();
  }

  setContext(context) {
    this.context = context;
  }

  subscribe(subscriber) {
    this.subscribers.add(subscriber);

    return () => {
      this.subscribers.delete(subscriber);
    }
  }

  notifySubscribers() {
    this.subscribers.forEach((subscriberCallback) => {
      subscriberCallback({
        generalComments: this.generalComments,
        comments: this.comments,
        tasks: this.tasks
      });
    });
  }

  /**
   * Loads the Git repository.
   * When the repository state changes, the `load` method is called and the `branchChangeCallback` is triggered.
   */
  loadGitRepository() {
    const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
    this.gitApi = gitExtension.getAPI(1);

    if (this.gitApi.repositories.length > 0) {
      this.initRepository();
    }

    this.gitApi.onDidChangeState(async () => {
      this.initRepository();
    });
  }

  async initRepository() {
    this.repository = this.gitApi.repositories[0];
      
    this.repository.state.onDidChange(async () => {
      if (!await this.load()) return;
      
      await this.loadComments();
    });

    if (!await this.load()) return;
      
    await this.loadComments();
  }

  /**
   * Loads the pull request associated with the current branch.
   * If the pull request cannot be found, the method returns early.
   * Otherwise, the `loaded` promise is resolved.
   */
  async load() {
    if (!this.connector) {
      this.connector = await this.connectToBitBucket();
    }

    if (!this.connector) return false;

    this.branchName = this.repository.state.HEAD.name;
    this.pullRequest = await this.getPullRequest();

    if (!this.pullRequest) return false;

    vscode.commands.executeCommand('setContext', CONTEXT_KEYS.prLoaded, true);    
    this.setLoaded();

    return true;
  }

  /**
   * Connects to BitBucket using the provided credentials and retrieves the project and repository information from the workspace state.
   * If the project or repository information is missing, the method returns false.
   * Otherwise, it creates a new instance of the BitBucketApiConnector class with the provided credentials.
   */
  async connectToBitBucket() {
    const ready = this.context.workspaceState.get(CONTEXT_KEYS.ready);
    
    if (!ready) return false;

    const username = await this.context.secrets.get(SECRET_KEYS.user);
    const password = await this.context.secrets.get(SECRET_KEYS.password);
    const token = await this.context.secrets.get(SECRET_KEYS.token);
    const hostURL = this.context.workspaceState.get(CONTEXT_KEYS.hostURL);
    const project = this.context.workspaceState.get(CONTEXT_KEYS.project);
    const repo = this.context.workspaceState.get(CONTEXT_KEYS.repository);
    
    return new BitBucketApiConnector(hostURL, project, repo, {
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

    this.notifySubscribers();
  }

  /**
   * Toggles the state of a task in the pull request.
   * @param {Object} task - The task to toggle.
   * @returns {Promise<Object>} - A promise that resolves with the updated task object.
   */
  async toggleTaskState(task) {
    const updatedTask = {
      ...task,
      ...await this.connector.changeTaskState(this.pullRequest.id, task.id, task.version, task.state === 'OPEN')
    };

    const index = this[updatedTask.type + 's'].findIndex((item) => item.id === updatedTask.id);
    this[updatedTask.type + 's'][index] = updatedTask;
    this.notifySubscribers();

    return updatedTask;
  }
}

export const pr = new PullRequest();