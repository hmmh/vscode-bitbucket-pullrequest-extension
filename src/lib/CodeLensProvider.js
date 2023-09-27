import vscode from 'vscode';

import { COMMAND_KEYS } from '@/config/variables.js';

import { getSuggestionContent } from '@/utils/suggestion.js';

export default class CodeLensProvider {
  constructor() {
    this.onDidChangeCodeLenses = new vscode.EventEmitter();
    this.codeLenses = [];
    this.comments = [];
  }

  setComments(comments) {
    this.comments = comments;
  }

  provideCodeLenses(document) {
    const file = document.fileName;

    this.comments.forEach((comment) => {
      if (
        !comment.text.includes('```suggestion')
        || !file.includes(comment.anchor.path)
        || comment.properties?.suggestionState === 'APPLIED'
      ) return false;

      const line = comment.anchor.line - 1;
      const range = new vscode.Range(line, 0, line, 0);
      const editorLine = document.lineAt(line);
    
      if (
        this.codeLenses.find(codeLens => codeLens.range.isEqual(range))
        || editorLine.text.includes(getSuggestionContent(comment))
      ) return false;

      this.codeLenses.push(new vscode.CodeLens(range, {
        command: COMMAND_KEYS.applySuggestion,
        title: 'Apply suggested change',
        arguments: [
          comment, 
          () => {
            this.removeLens(this.codeLenses.length - 1);
          }
        ],
      }));
    });

    return this.codeLenses;
  }

  removeLens(index) {
    this.codeLenses.splice(index, 1);
    this.onDidChangeCodeLenses.fire();
  }
}