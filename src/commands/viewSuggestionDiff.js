import vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import os from 'os';

function createDir(filePath) {
  const dirname = path.dirname(filePath);
  
  if (fs.existsSync(dirname)) {
    return true;
  }

  fs.mkdirSync(dirname, {recursive: true});
}

function createTempFile(fileName, content) {
  let tmpDir;
  const appPrefix = 'vs-code-bitbucket-pullrequest-extension';

  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
  const filePath = path.join(tmpDir, fileName);
  createDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');

  return filePath;
}

export async function viewSuggestionDiff(comment) {
  const file = comment.anchor.path;
  const workspace = vscode.workspace.workspaceFolders[0].uri.path;
  const uri = vscode.Uri.parse(file);
  const filePath = path.join(workspace, uri.path);
  const fileContentLines = fs.readFileSync(filePath, 'utf8').split('\n');
  const lineNumber = comment.anchor.line - 1;
  const newLine = comment.text.replace('```suggestion', '').replace('```', '').trim();

  fileContentLines[lineNumber] = newLine;

  const newFileContent = fileContentLines.join('\n');
  
  const newFilePath = createTempFile(file, newFileContent);

  vscode.commands.executeCommand('vscode.diff', vscode.Uri.file(filePath), vscode.Uri.file(newFilePath), 'Suggested change');
}