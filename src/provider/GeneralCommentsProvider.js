import vscode from 'vscode';

export class GeneralCommentsProvider {  
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.comments = [];
	}

  updateData(comments) {
    this.comments = comments;

    this.refresh();
  }

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
		return element;
	}

	async getChildren() {
    const items = [];

    this.comments.forEach((comment) => {
      items.push(new Comment(comment));
    });

    return items;
	}
}

export class Comment extends vscode.TreeItem {
  constructor(comment) {
    super(comment.text, vscode.TreeItemCollapsibleState.None);
  }
}
