/** Replaces `{name}` placeholders with plain values in a client-safe copy string. */
export function formatTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{([a-z]+)\}/gi, (match, key: string) => values[key] ?? match);
}
