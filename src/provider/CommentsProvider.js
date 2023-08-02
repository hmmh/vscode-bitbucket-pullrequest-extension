import vscode from 'vscode';
import path from 'path';

export class CommentsProvider {  
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.files = {};
	}

  /**
   * Groups comments by files and refreshes the view.
   * @param {Array} comments - The comments to update the data with.
   */
  updateData(comments) {
    comments.forEach(comment => {
      if (!this.files[comment.anchor.path]) {
        this.files[comment.anchor.path] = [];
      }

      this.files[comment.anchor.path].push(comment);
    });

    this.refresh();
  }

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
		return element;
	}

	async getChildren(element) {
    if (element) {
      return await element.getChildren();
    }
    const items = [];

    Object.entries(this.files).forEach(([filePath, comments]) => {
      items.push(new File(filePath, comments));
    });

    return items;
	}
}

export class File extends vscode.TreeItem {
  constructor(filePath, comments) {
    super(path.basename(filePath), vscode.TreeItemCollapsibleState.Collapsed);
    this.comments = comments;
  }

  async getChildren() {
    const items = [];

    this.comments.forEach(comment => {
      items.push(new Comment(comment));
    });

    return items;
	}
}

export class Comment extends vscode.TreeItem {
  constructor(comment) {
    super(comment.text, vscode.TreeItemCollapsibleState.None);

    this.command = {
      command: 'bitbucket-pullrequest-tasks.goToComment',
      title: 'Go to task',
      arguments: [comment]
    };
  }
}
