export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...userKeys.lists(), params] as const,
    infiniteLists: () => [...userKeys.all, 'infinite-list'] as const,
    infiniteList: (params?: Record<string, unknown>) => [...userKeys.infiniteLists(), params] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
}
