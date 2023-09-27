export function getSuggestionContent(comment) {
  const match = /```suggestion([\s\S]*?)```/g.exec(comment.text);

  if (!match?.[1]) return '';

  return match[1].trim();
}