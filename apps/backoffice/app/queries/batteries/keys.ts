export const batteryKeys = {
    all: ['batteries'] as const,
    lists: () => [...batteryKeys.all, 'list'] as const,
    list: (params?: unknown) => [...batteryKeys.lists(), params] as const,
    details: () => [...batteryKeys.all, 'detail'] as const,
    detail: (id: string) => [...batteryKeys.details(), id] as const,
}
