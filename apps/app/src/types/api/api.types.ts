export type PaginateQuery<T> = {
    results: T[]
    count: number
    next: string | null
    previous: string | null
}

export type KeyParams = Record<string, unknown>

export type URLParameters = Record<string, string>
