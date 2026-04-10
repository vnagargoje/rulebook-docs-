/**
 * Common shared types across the yugo monorepo.
 */

export type Nullable<T> = T | null

export type AsyncResult<T, E = Error> = Promise<{ data: T; error: null } | { data: null; error: E }>
