// Fills {placeholders} in the pricing copy with values from code.
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), template);
}
