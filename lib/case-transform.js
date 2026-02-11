/**
 * camelCase ↔ snake_case recursive object key transformers
 */

/**
 * Convert object keys from camelCase to snake_case (recursive)
 */
export function toSnakeCase(obj) {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj.constructor !== Object) return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`),
      toSnakeCase(v),
    ])
  );
}

/**
 * Convert object keys from snake_case to camelCase (recursive)
 */
export function toCamelCase(obj) {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj.constructor !== Object) return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      toCamelCase(v),
    ])
  );
}
