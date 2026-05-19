/** Parse item level text (e.g. `200` or `200 / 213`) into numbers. */
export function parseItemLevelInput(text: string): number[] {
  const segments = text
    .split(/[/,]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  return segments
    .map((segment) => Number(segment))
    .filter((value) => Number.isFinite(value));
}
