import fetch, { Headers } from 'node-fetch';


/**
 * Class representing a connection to the BitBucket API.
 */
export default class BitBucketApiConnector {
  constructor(project, repository, credentials) {
    this.baseUrl = 'https://bitbucket.hmmh.de/rest/api/latest';
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
    // NDM0NzQ5NTE2ODIwOsVSgk901UBGWLlxovaRCdZXrRfv
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
      `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/pull-requests/${pullRequestId}/activities?limit=1000`, 
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
            anchor: activity.commentAnchor
          });
          return;
        }
        comments.push({
          ...activity.comment,
          anchor: activity.commentAnchor
        });
      } else if (activity.comment) {
        generalComments.push(activity.comment);
      }
    });

    return {
      generalComments,
      comments,
      tasks
    };
  }
}