import { pr } from '@/lib/PullRequest.js';

export default async function toggleTask(task) {
  await pr.toggleTaskState(task.task);
}