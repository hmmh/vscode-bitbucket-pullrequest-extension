import vscode from 'vscode';
import path from 'path';

export class File extends vscode.TreeItem {
  constructor(filePath, children, ChildClass) {
    super(path.basename(filePath), vscode.TreeItemCollapsibleState.Collapsed);
    this.description = filePath;

    this.ChildClass = ChildClass;
    this.children = children.sort((a, b) => a.anchor.line - b.anchor.line);
  }

  async getChildren() {
    const items = [];

    this.children.forEach(child => {
      items.push(new this.ChildClass(child));
    });

    return items;
	}
}