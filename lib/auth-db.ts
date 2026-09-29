import { markDbAvailable, markDbUnavailable } from "@/lib/db-query";

const AUTH_DB_TIMEOUT_MS = Number(
  process.env.AUTH_DB_TIMEOUT_MS ?? (process.env.NODE_ENV === "development" ? 2500 : 8000)
);

export function isDatabaseError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("database timeout") ||
    message.includes("server selection timeout") ||
    message.includes("fatal alert") ||
    message.includes("prisma") ||
    message.includes("mongodb")
  );
}

/** Run an auth-related DB operation with a hard timeout. */
export async function withAuthDb<T>(operation: () => Promise<T>): Promise<T> {
  try {
    const result = await Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Database timeout")), AUTH_DB_TIMEOUT_MS);
      })
    ]);
    markDbAvailable();
    return result;
  } catch (error) {
    if (isDatabaseError(error)) {
      markDbUnavailable();
    }
    throw error;
  }
}
