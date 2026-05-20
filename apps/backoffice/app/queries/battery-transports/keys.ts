export const batteryTransportKeys = {
    all: ['battery-transports'] as const,
    lists: () => [...batteryTransportKeys.all, 'list'] as const,
    list: (params?: unknown) => [...batteryTransportKeys.lists(), params] as const,
    details: () => [...batteryTransportKeys.all, 'detail'] as const,
    detail: (id: string) => [...batteryTransportKeys.details(), id] as const,
}
