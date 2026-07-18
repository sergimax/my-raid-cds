/**
 * Build a numeric item-id map from bundled JSON keyed by string ids.
 * Call once at module init so hot paths avoid `Record[String(itemId)]`.
 */
export function buildItemIdMap<T>(record: Record<string, T>): Map<number, T> {
  const map = new Map<number, T>();
  for (const [key, value] of Object.entries(record)) {
    const itemId = Number(key);
    if (Number.isInteger(itemId) && itemId > 0) {
      map.set(itemId, value);
    }
  }
  return map;
}
