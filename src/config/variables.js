export const TREEVIEW_KEYS = {
  tasks: 'bitbucket-pullrequest-tasks-list',
  comments: 'bitbucket-pullrequest-comments-list',
  generalComments: 'bitbucket-pullrequest-general-comments-list',
};

export const SECRET_KEYS = {
  user: 'bitbucket-pullrequest-tasks.username',
  password: 'bitbucket-pullrequest-tasks.password',
  token: 'bitbucket-pullrequest-tasks.token',
};

export const CONTEXT_KEYS = {
  hostURL: 'bitbucket-pullrequest-tasks.hostURL',
  project: 'bitbucket-pullrequest-tasks.project',
  repository: 'bitbucket-pullrequest-tasks.repository',
  ready: 'bitbucket-pullrequest-tasks.ready',
  prLoaded: 'bitbucket-pullrequest-tasks.prLoaded',
  commentLines: 'bitbucket-pullrequest-tasks.commentLines',
};

export const COMMAND_KEYS = {
  goToComment: 'bitbucket-pullrequest-tasks.goToComment',
  auth: 'bitbucket-pullrequest-tasks.auth',
  authWithToken: 'bitbucket-pullrequest-tasks.authWithToken',
  setupProject: 'bitbucket-pullrequest-tasks.setupProject',
  resetProject: 'bitbucket-pullrequest-tasks.resetProject',
  setHostURL: 'bitbucket-pullrequest-tasks.setHostURL',
  createPR: 'bitbucket-pullrequest-tasks.createPR',
  reloadComments: 'bitbucket-pullrequest-tasks.reloadComments',
  showCommentDetails: 'bitbucket-pullrequest-tasks.showCommentDetails',
  toggleTask: 'bitbucket-pullrequest-tasks.toggleTask',
  applySuggestion: 'bitbucket-pullrequest-tasks.applySuggestion',
};

export const COMMENT_TYPES = {
  task: 'task',
  comment: 'comment',
  generalComment: 'generalComment',
};