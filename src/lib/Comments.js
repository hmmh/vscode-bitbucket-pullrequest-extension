import vscode from 'vscode';
import path from 'path';


/**
 * Class representing a collection of comments.
 */
export default class Comments {
  constructor(context) {
    this.context = context;
    this.comments = {};
  }

  /**
   * Sets the comments.
   * @param {Array} comments - An array of comments to be set.
   */
  setComments(comments) {
    comments.forEach(comment => {
      if (this.comments[comment.id]) return;

      this.comments[comment.id] = {
        comment,
        tooltip: this.setCommentTooltip(comment),
        // decoration: this.setCommentTooltip(comment)
      };

      this.setLineDecoration(comment);
    });
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
  
    // set tooltip
    const hoverProvider = vscode.languages.registerHoverProvider({ pattern: filePath }, {
      provideHover(document, position) {  
        if (position.line !== comment.anchor.line - 1) return;

        const markdownString = new vscode.MarkdownString();
        markdownString.appendMarkdown(`<h2>PullRequest Comment</h2><strong>${comment.author.displayName}</strong>: ${comment.text}`);
        markdownString.supportHtml = true;
        markdownString.isTrusted = true;

        return new vscode.Hover(markdownString);
      }
    });
    
    this.context.subscriptions.push(hoverProvider);

    return hoverProvider;
  }

  setLineDecoration(comment) {
    const editor = vscode.window.activeTextEditor;
    const line = comment.anchor.line - 1;
    const range = new vscode.Range(line, 0, line, 0);

    const decorationType = vscode.window.createTextEditorDecorationType({
      gutterIconPath: new vscode.ThemeIcon('pencil')
    });
  
    editor.setDecorations(decorationType, [{ range }]);
  }

  // setCommentDecoration(comment) {
  //   const editor = vscode.window.activeTextEditor;
  //   const tooltipDecorationType = vscode.window.createTextEditorDecorationType({
  //     before: {
  //       contentText: 'commented',
  //       margin: '10px'
  //     }
  //   });
    
  //   const pos = editor.selection.active;
  //   const activeLine = editor.document.lineAt(pos.line);
  //   const lineRange = activeLine.range;
    
  //   editor.setDecorations(tooltipDecorationType, [{
  //     range: lineRange
  //   }]);
  // }
}
