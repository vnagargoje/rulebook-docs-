import { v1UserPlansGetMyPlans } from '~/services/api/sdk'

export type V1UserPlansGetMyPlansParams = Parameters<typeof v1UserPlansGetMyPlans>[0]

export const userPlanKeys = {
    all: ['user-plans'] as const,
    lists: () => [...userPlanKeys.all, 'list'] as const,
    list: (filters?: Omit<NonNullable<V1UserPlansGetMyPlansParams>, 'page'>) => [...userPlanKeys.lists(), { filters }] as const,
    details: () => [...userPlanKeys.all, 'detail'] as const,
    detail: (id: string) => [...userPlanKeys.details(), id] as const,
}
