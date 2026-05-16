export const kycKeys = {
    all: ['kyc'] as const,
    lists: () => [...kycKeys.all, 'list'] as const,
    list: (filters: string | Record<string, unknown>) => [...kycKeys.lists(), { filters }] as const,
    details: () => [...kycKeys.all, 'detail'] as const,
    detail: (id: string) => [...kycKeys.details(), id] as const,
}
