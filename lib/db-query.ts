import { logDbFallback } from "@/lib/db-fallback";

const DB_TIMEOUT_MS = Number(process.env.DB_QUERY_TIMEOUT_MS ?? 5000);

let dbUnavailable = false;

export function isDbUnavailable() {
  return dbUnavailable;
}

export function markDbUnavailable() {
  dbUnavailable = true;
}

export function markDbAvailable() {
  dbUnavailable = false;
}

/** Run a DB query with a timeout; fall back quickly if MongoDB is slow or unreachable. */
export async function queryDb<T>(
  scope: string,
  query: () => Promise<T>,
  fallback: () => T,
  timeoutMs = DB_TIMEOUT_MS
): Promise<T> {
  if (dbUnavailable) {
    return fallback();
  }

  try {
    const result = await Promise.race([
      query(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Database timeout")), timeoutMs);
      })
    ]);
    markDbAvailable();
    return result;
  } catch {
    markDbUnavailable();
    logDbFallback(scope);
    return fallback();
  }
}
