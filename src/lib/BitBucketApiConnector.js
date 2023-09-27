import fetch, { Headers } from 'node-fetch';

import { COMMENT_TYPES } from '@/config/variables.js';

/**
 * Class representing a connection to the BitBucket API.
 */
export default class BitBucketApiConnector {
  constructor(hostURL, project, repository, credentials) {
    this.baseUrl = `${hostURL}/rest/api/latest`;
    this.project = project;
    this.repository = repository;
    this.credentials = credentials;

    this.getBearer();
  }

  /**
   * Retrieves the bearer token for the BitBucket API connection.
   * If a token is provided in the credentials, it will be used.
   */
  getBearer() {
    // const url = `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/branches`;

    // const headers = new Headers();
    // headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

    // fetch(url, { headers })
    //   .then(res => res.json())
    //   .then(json => {
    //     this.bearerToken = json.values[0].latestCommit;
    //   });
    // 
    if (this.credentials.token) this.bearerToken = this.credentials.token;
  }

  /**
   * Retrieves all open pull requests for the specified project and repository.
   * @returns {Promise<Array>} A promise that resolves to an array of pull request objects.
   */
  async getPullRequests() {
    const pullRequests = await fetch(
      `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/pull-requests?limit=1000`, 
      {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`
        }
      }
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    
    return pullRequests.values.filter(pr => pr.state === 'OPEN');
  }

  /**
   * Retrieves the pull request associated with the specified branch.
   * @param {string} branch - The name of the branch to search for.
   * @returns {Promise<Object>} A promise that resolves to the pull request object associated with the specified branch.
   */
  async getPullRequestByBranch(branch) {
    const pullRequests = await this.getPullRequests();
    return pullRequests.find(pr => pr.fromRef.displayId === branch);
  }

  /**
   * Retrieves all comments and tasks associated with the specified pull request.
   * @param {string} pullRequestId - The ID of the pull request to retrieve comments for.
   * @returns {Promise<Object>} A promise that resolves to an object containing general comments, comments, and tasks associated with the specified pull request.
   */
  async getPullRequestComments(pullRequestId) {
    const { values: activities } = await fetch(
      `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/pull-requests/${pullRequestId}/activities?limit=1000&avatarSize=32`, 
      {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`
        }
      }
    )
      .then(res => res.json())
      .catch(err => console.log(err));

    const generalComments = [];
    const comments = [];
    const tasks = [];
    activities.forEach(activity => {
      if (activity.commentAnchor) {
        if (activity.comment.severity === 'BLOCKER') {
          tasks.push({
            ...activity.comment,
            anchor: activity.commentAnchor,
            type: COMMENT_TYPES.task
          });
          return;
        }
        comments.push({
          ...activity.comment,
          anchor: activity.commentAnchor,
          type: COMMENT_TYPES.comment
        });
      } else if (activity.comment) {
        generalComments.push({
          ...activity.comment,
          type: COMMENT_TYPES.generalComment
        });
      }
    });

    return {
      generalComments,
      comments,
      tasks
    };
  }

  async changeTaskState(pullRequestId, taskId, taskVersion, resolved) {
    const url = `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/pull-requests/${pullRequestId}/comments/${taskId}`;
    const body = {
      version: taskVersion,
      state: resolved ? 'RESOLVED' : 'OPEN'
    };

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return res.json();
  }

  async changeSuggestionState(pullRequestId, comment, commentVersion) {
    const url = `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/pull-requests/${pullRequestId}/comments/${comment}`;
    const body = {
      version: commentVersion,
      properties: {
        suggestionState: 'APPLIED'
      }
    };

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return res.json();
  }
}