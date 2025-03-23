export type OneOrMany<T> = T | T[];

export function asArray<T>(value: OneOrMany<T> | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}
