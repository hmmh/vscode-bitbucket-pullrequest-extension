import fetch, { Headers } from 'node-fetch';

export default class BitBucketApiConnector {
  constructor(project, repository, credentials) {
    this.baseUrl = 'https://bitbucket.hmmh.de/rest/api/latest';
    this.project = project;
    this.repository = repository;
    this.credentials = credentials;

    this.getBearer();
  }

  // Get bearer token from bitbucket
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

  async getPullRequests() {
    const pullRequests = await fetch(
      `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/pull-requests`, 
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

  async getPullRequestByBranch(branch) {
    const pullRequests = await this.getPullRequests();
    return pullRequests.find(pr => pr.fromRef.displayId === branch);
  }

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