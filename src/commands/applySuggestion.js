import vscode from 'vscode';

import { COMMENT_TYPES } from '@/config/variables.js';

import { pr } from '@/lib/PullRequest.js';
import { getSuggestionContent } from '@/utils/suggestion.js';

export default function applySuggestion(comment, removeLens) {
  const editor = vscode.window.activeTextEditor;
  const line = comment.anchor.line - 1;
  const editorLine = editor.document.lineAt(line);

  const text = getSuggestionContent(comment);

  if (!text) return false;

  editor.edit((editBuilder) => {
    editBuilder.replace(editorLine.range, text);
  });

  pr.toggleTaskState(comment);

  if (removeLens) removeLens();
}