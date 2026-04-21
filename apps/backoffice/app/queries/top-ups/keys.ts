export const topUpKeys = {
    all: ['top-ups'] as const,
    lists: () => [...topUpKeys.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...topUpKeys.lists(), params] as const,
    details: () => [...topUpKeys.all, 'detail'] as const,
    detail: (id: string) => [...topUpKeys.details(), id] as const,
}
