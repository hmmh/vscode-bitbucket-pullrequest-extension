import vscode from 'vscode';
import path from 'path';

import { CONTEXT_KEYS } from '@/config/variables.js';

import { getTooltipMarkdown } from '@/utils/markdown.js';
import { groupCommentsByFiles } from '@/utils/groupCommentsByFiles.js';

import CodeLensProvider from './CodeLensProvider.js';

/**
 * Class representing a collection of comments.
 */
export default class Comments {
  constructor() {
    this.comments = [];
    this.codeLenseProviders = new Set();

    vscode.window.onDidChangeActiveTextEditor(this.textEditorChanged.bind(this));
  }

  /**
   * Sets the context for the Comments instance.
   *
   * @param {Object} context - The context to set.
   */
  setContext(context) {
    this.context = context;
  }

  /**
   * Sets the comments for the current file and updates the context keys.
   * @param {Array} comments - An array of comments to set.
   * @returns {void}
   */
  setComments(comments) {
    this.cleanup();

    comments.forEach((comment) => {
      this.comments.push({
        comment,
        tooltip: this.setCommentTooltip(comment),
      });
    });

    this.setCodeLens(comments);
    
    this.textEditorChanged(vscode.window.activeTextEditor);
  }

  cleanup() {
    this.comments.forEach(comment => {
      this.removeCommentTooltip(comment);
    });

    this.codeLenseProviders.forEach(provider => {
      provider.dispose();
    });

    this.codeLenseProviders.clear();
    this.comments = [];
  }

  /**
   * Removes the tooltip associated with a comment.
   *
   * @param {Comment} comment - The comment object to remove the tooltip from.
   */
  removeCommentTooltip(comment) {
    comment.tooltip.dispose();
  }

  /**
   * Sets the tooltip for a given comment.
   * @param {Object} comment - The comment object to set the tooltip for.
   * @returns {Object} - The hover provider object for the tooltip.
   */
  setCommentTooltip(comment) {
    const file = comment.anchor.path;
    const workspace = vscode.workspace.workspaceFolders[0].uri.path;
    const uri = vscode.Uri.parse(file);
    const filePath = path.join(workspace, uri.path);
    const hostURL = this.context.workspaceState.get(CONTEXT_KEYS.hostURL);
  
    // set tooltip
    const hoverProvider = vscode.languages.registerHoverProvider({ pattern: filePath }, {
      provideHover(document, position) {  
        if (position.line !== comment.anchor.line - 1) return;

        return new vscode.Hover(getTooltipMarkdown(comment, hostURL));
      }
    });
    
    this.context.subscriptions.push(hoverProvider);

    return hoverProvider;
  }

  /**
   * Sets a line decoration for a comment in the editor.
   * @param {Comment} comment - The comment to set the decoration for.
   * @param {vscode.TextEditor} editor - The editor to set the decoration in.
   * @returns {void}
   */
  setLineDecoration(comment, editor) {
    const line = comment.anchor.line - 1;
    const range = new vscode.Range(line, 0, line, 0);

    const decorationType = vscode.window.createTextEditorDecorationType({
      light: {
        gutterIconPath: this.context.asAbsolutePath('assets/icons/light/comment-unresolved.svg')
      },
      dark: {
        gutterIconPath: this.context.asAbsolutePath('assets/icons/dark/comment-unresolved.svg')
      },
      gutterIconSize: '50%',
      overviewRulerColor: new vscode.ThemeColor('minimap.warningHighlight'),
    });
    
    editor.setDecorations(decorationType, [{range}]);
  }

  /**
   * Set line decorations when text editor changes.
   * @param {TextEditor} editor - The text editor that was changed.
   */
  textEditorChanged(editor) {
    if (!editor) return;
    const lines = [];

    const file = editor.document.fileName;

    this.comments.forEach(comment => {
      if (!file.includes(comment.comment.anchor.path)) return;

      lines.push(comment.comment.anchor.line);

      this.setLineDecoration(comment.comment, editor);
    });

    vscode.commands.executeCommand('setContext', CONTEXT_KEYS.commentLines, lines);
  }

  /** 
   * Add codelens for comments.
   */
  setCodeLens(comments) {
    const files = groupCommentsByFiles(comments);

    const workspace = vscode.workspace.workspaceFolders[0].uri.path;
    
    this.codeLenseProviders = new Set();
    files.forEach((comments, file) => {
      const uri = vscode.Uri.parse(file);
      const filePath = path.join(workspace, uri.path);

      const lens = new CodeLensProvider();
      lens.setComments(comments);
      this.codeLenseProviders.add(vscode.languages.registerCodeLensProvider({ pattern: filePath }, lens));
    });
  }
}

export const comments = new Comments();