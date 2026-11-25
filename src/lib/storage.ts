/** Безопасные обёртки над localStorage: хранилище может быть недоступно. */

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Квота исчерпана или приватный режим — продолжаем работу в памяти.
  }
}

export function storageGetRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function storageSetRaw(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Сохранение необязательно для работы приложения.
  }
}

/** crypto.randomUUID доступен не везде (например, на LAN-IP без HTTPS). */
export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
