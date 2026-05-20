import { Api } from './codegen/Api'
import { getAuthFromStorage, removeAuthFromStorage } from '~/lib/token'

const apiUrl = (import.meta.env.VITE_API_URL as string) || 'https://api.evyugo.com'

export const api = new Api({
    baseURL: apiUrl,
})

// Add auth interceptor to the generated client's xior instance
api.instance.interceptors.request.use((config) => {
    const auth = getAuthFromStorage()
    if (auth?.accessToken) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${auth.accessToken}`,
        }
    }
    return config
})

api.instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeAuthFromStorage()
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export const {
    v1AuthSignIn,
    v1AuthSendOtp,
    v1AuthVerifyOtp,
    v1CitiesListManyCities,
    v1StatesListManyStates,
    v1UsersGetManyUsers,
    v1UsersGetOneUser,
    v1UsersCreateOneUser,
    v1UsersPatchOneUser,
    v1UsersUpdateAddresses,
    v1PlansGetPlans,
    v1PlansGetPlanById,
    v1PlansAdminCreatePlan,
    v1PlansAdminUpdatePlan,
    v1TopUpsGetTopUps,
    v1TopUpsGetTopUpById,
    v1TopUpsAdminCreateTopUp,
    v1TopUpsAdminUpdateTopUp,
    v1BookingsGetAllBookings,
    v1BookingsGetBookingById,
    v1BookingsAdminAssignVehicle,
    v1StationsGetManyStations,
    v1StationsCreateOneStation,
    v1StationsGetOneStation,
    v1StationsUpdateOneStation,
    v1VehiclesGetManyVehicles,
    v1VehiclesCreateOneVehicle,
    v1VehiclesGetOneVehicle,
    v1VehiclesUpdateOneVehicle,
    v1BatteriesGetManyBatteries,
    v1BatteriesCreateOneBattery,
    v1BatteriesGetOneBattery,
    v1BatteriesUpdateOneBattery,
    v1VehicleSurrenderGetAllSurrenders,
    v1VehicleSurrenderGetSurrenderDetails,
    v1VehicleSurrenderSurrenderVehicle,
    v1UserPlansGetMyPlans,
    v1UserPlansGetMyPlanById,
    v1TransactionsGetTransactions,
    v1TransactionsGetTransactionById,
    v1BatterySwapsGetSwapHistory,
    v1BatteryTransportsGetManyMovements,
    v1BatteryTransportsGetOneMovement,
} = api.v1
