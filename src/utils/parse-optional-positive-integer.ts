/** Parse optional whole-number text; empty input yields `undefined`. */
export function parseOptionalPositiveInteger(text: string): number | undefined {
  const trimmed = text.trim();
  if (!trimmed) {
    return undefined;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value <= 0) {
    return Number.NaN;
  }
  return value;
}
