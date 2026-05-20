export const swapHistoryKeys = {
    all: ['swap-history'] as const,
    lists: () => [...swapHistoryKeys.all, 'list'] as const,
    list: (params?: unknown) => [...swapHistoryKeys.lists(), params] as const,
}
