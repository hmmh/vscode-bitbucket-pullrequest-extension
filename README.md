# BitBucket Pull Request Task View

A VS Code extension that displays tasks and comments of the corresponding Pull Request for your current branch in BitBucket. It is currently only tested with BitBucket server version **7.21.0**.

## Quickstart

Once you've added this extension, get a new icon in the left toolbar.

![Toolbar](https://raw.githubusercontent.com/hmmh/vscode-bitbucket-pullrequest-extension/main/docs/assets/toolbar-icon.png)

When it's your first time, you need to configure it.

![Startup screen](https://raw.githubusercontent.com/hmmh/vscode-bitbucket-pullrequest-extension/main/docs/assets/startup-screen.png)

By clicking on "Setup Project" you enter the host url of your BitBucket server, the BitBucket project and the Repository name. Normally those values should be prefilled.

![Authentication screen](https://raw.githubusercontent.com/hmmh/vscode-bitbucket-pullrequest-extension/main/docs/assets/authentication-screen.png)

After that you get to the next screen which asks you to authenticate. Authentication is made via BitBucket access tokens (http token). If you don't already have one, you can generate one by clicking on the displayed link. When you click on "Authenticate" you will need to enter that token.

### Sections
Once everything is set up and there is a Pull Request, you will get three sections in that sidebar.

![Tasks and Comments](https://raw.githubusercontent.com/hmmh/vscode-bitbucket-pullrequest-extension/main/docs/assets/views.png)

#### Tasks
The first section shows all tasks of the current Pull Request. They are grouped by the files they are made in. You can click on a task to open the file and jump to the line where the task is located.
You can also see the status of the task, displayed by the checkbox in front of them. If you click on the checkbox, the task will be marked as done in BitBucket. 
To get more information about the task, you can hover over it and a tooltip will appear.

#### Comments
The second section is build up the same, but it only show comments, that are made on a file.

#### General Comments
The third section is build for the comments that aren't made on a specific file but on the whole Pull Request. It can not only have comments but also tasks.

### Files
If you opened a file, that has comments or tasks, you will see an icon in front of the line number of each line, that has comments. Sadly it is currently not possible to intercept any interaction with this icon, so it's only purpose is to be a visual indicator.

### Tooltips

If you hover over a task, comment, or a line on which something is commented, you will get a tooltip with more information about it.
![Tooltip](https://raw.githubusercontent.com/hmmh/vscode-bitbucket-pullrequest-extension/main/docs/assets/tooltip.png)

## Authentication

### Via user credentials
Not implemented yet.

### Via access token
* Go to https://bitbucket.hmmh.de/plugins/servlet/access-tokens/users/YOUR.USER/manage
* Generate token
* Run command "Bitbucket PullRequest Tasks: Authenticate with token""
* Enter your token

## BitBucket Setup

* Run "Bitbucket PullRequest Tasks: Setup Project"
* Enter host url, project name and Repository name