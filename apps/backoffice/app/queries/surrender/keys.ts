export const surrenderKeys = {
    all: ['surrender'] as const,
    lists: () => [...surrenderKeys.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...surrenderKeys.lists(), params] as const,
    details: () => [...surrenderKeys.all, 'detail'] as const,
    detail: (vehicleNumber: string) => [...surrenderKeys.details(), vehicleNumber] as const,
}
