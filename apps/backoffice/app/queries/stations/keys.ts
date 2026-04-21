export const stationKeys = {
    all: ['stations'] as const,
    lists: () => [...stationKeys.all, 'list'] as const,
    list: (params?: unknown) => [...stationKeys.lists(), params] as const,
    details: () => [...stationKeys.all, 'detail'] as const,
    detail: (id: string) => [...stationKeys.details(), id] as const,
}
