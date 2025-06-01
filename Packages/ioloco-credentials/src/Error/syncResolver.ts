// =========================================
// Sync Resolver
// =========================================
export default function syncResolver<T>(fn: () => T): [T | null, Error | null] {
  try {
    return [fn(), null]
  } catch (err) {
    return [null, err as Error]
  }
}
