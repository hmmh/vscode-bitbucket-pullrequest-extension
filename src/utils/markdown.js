import vscode from 'vscode';

export function getCommentMarkdown(comment, hostURL) {
  const markdownString = new vscode.MarkdownString();
  markdownString.appendMarkdown(`<img src="${hostURL}${comment.author.avatarUrl}" width="16"> <strong>${comment.author.displayName}</strong> commented:<hr> ${comment.text}`);
  markdownString.supportHtml = true;
  markdownString.isTrusted = true;

  return markdownString;
}