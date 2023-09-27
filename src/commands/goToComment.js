import vscode from 'vscode';
import path from 'path';

import { viewSuggestionDiff } from '@/commands/viewSuggestionDiff.js';

/**
 * Opens the file containing the given comment and sets the cursor position to the comment's line.
 * @param {Object} comment - The comment object containing the anchor path and line number.
 */
export default async function goToComment(comment) {
  // if (comment.text.includes('```suggestion')) {
  //   viewSuggestionDiff(comment);
  //   return;
  // }

  // open file
  const file = comment.anchor.path;
  const workspace = vscode.workspace.workspaceFolders[0].uri.path;
  const uri = vscode.Uri.parse(file);
  const filePath = path.join(workspace, uri.path);
  let doc = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(doc, { preview: false });

  // set cursor position
  const editor = vscode.window.activeTextEditor;
  const line = comment.anchor.line - 1;
  const cursorPos = new vscode.Position(line, 0);
  editor.selections = [new vscode.Selection(cursorPos, cursorPos)]; 

  const range = new vscode.Range(cursorPos, cursorPos);
  editor.revealRange(range);
}