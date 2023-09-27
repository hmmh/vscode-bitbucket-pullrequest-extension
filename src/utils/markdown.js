import vscode from 'vscode';

export function getTooltipMarkdown(comment, hostURL) {
  const markdownString = new vscode.MarkdownString();
  markdownString.appendMarkdown(`<img src="${hostURL}${comment.author.avatarUrl}" width="16"> <strong>${comment.author.displayName}</strong> commented:<hr> ${comment.text}`);
  markdownString.supportHtml = true;
  markdownString.isTrusted = true;

  return markdownString;
}

export function stripMarkdown(text) {
  // Replace all markdown formatting with empty string
  const plainText = text
    .replace(/`{3}suggestion\s?([\s\S]*)\s?`{3}/g, 'suggestion: $1')
    .replace(/([*_~|`])(?=\S)(.*?\S)\1/g, '$2')
    .replace(/^(#+)(.*)/gm, '$2')
    .replace(/^(=|-){2,}\s*$/gm, '')
    .replace(/`{3}.*\n([\s\S]*?)\n`{3}/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^(.*)[\n\r]*$/gm, '$1');

  // Replace all HTML tags with empty string
  const plainTextWithoutHTML = plainText.replace(/(<([^>]+)>)/gi, '');

  return plainTextWithoutHTML.trim();
}