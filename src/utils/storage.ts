export const XZB_RECORDS = 'xzb_records';
export const XZB_CATEGORIES = 'xzb_categories';

export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setStorage(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}
