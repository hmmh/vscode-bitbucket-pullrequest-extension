import PullRequest from '../lib/PullRequest';

export default async function getTasksCommand(context) {
  console.log(await getTasks(context));
}