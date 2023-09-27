export function groupCommentsByFiles(comments) {
  const files = new Map();

  comments.forEach((comment) => {
    if (!files.has(comment.anchor.path)) {
      files.set(comment.anchor.path, []);
    }

    files.get(comment.anchor.path).push(comment);
  });

  return files;
}