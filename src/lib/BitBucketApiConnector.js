import fetch, { Headers } from 'node-fetch';

export default class BitBucketApiConnector {
  constructor(project, repository, username, password) {
    this.baseUrl = 'https://bitbucket.hmmh.de/rest/api/latest';
    this.project = project;
    this.repository = repository;

    this.getBearer(username, password);
  }

  // Get bearer token from bitbucket
  getBearer(username, password) {
    // const url = `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/branches`;

    // const headers = new Headers();
    // headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

    // fetch(url, { headers })
    //   .then(res => res.json())
    //   .then(json => {
    //     this.token = json.values[0].latestCommit;
    //   });
    this.token = 'NDM0NzQ5NTE2ODIwOsVSgk901UBGWLlxovaRCdZXrRfv';
  }

  async getPullRequests() {
    const pullRequests = await fetch(
      `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/pull-requests`, 
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
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

  async getPullRequestTasks(pullRequestId) {
    const tasks = await fetch(
      `${this.baseUrl}/projects/${this.project}/repos/${this.repository}/pull-requests/${pullRequestId}/blocker-comments`, 
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    )
      .then(res => res.json())
      .catch(err => console.log(err));    

    return tasks;
  }
}