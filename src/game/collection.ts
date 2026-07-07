const STORAGE_KEY = "sprite-hunter-collection";

export interface SpriteRecord {
  captures: number;
}

export type Collection = Record<string, SpriteRecord>;

export function loadCollection(): Collection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Collection;
  } catch {
    return {};
  }
}

function save(collection: Collection): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch {
    // Storage full or blocked — game still works.
  }
}

export function recordCapture(spriteId: string): Collection {
  const col = loadCollection();
  const prev = col[spriteId] ?? { captures: 0 };
  col[spriteId] = { captures: prev.captures + 1 };
  save(col);
  return col;
}

export function spriteLevel(spriteId: string, collection: Collection): number {
  return collection[spriteId]?.captures ?? 0;
}
