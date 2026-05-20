export const isEnabled = false
export const isEmbeddedLaunch = true
export const updateId = null
export const channel = null
export const runtimeVersion = null
export const checkAutomatically = null
export const manifest = {}
export const createdAt = null
export const isEmergencyLaunch = false
export const emergencyLaunchReason = null
export const launchDuration = null
export const isUsingEmbeddedAssets = true
export const localAssets = {}

export const checkForUpdateAsync = jest.fn(() => Promise.resolve({ isAvailable: false }))
export const fetchUpdateAsync = jest.fn(() => Promise.resolve({ isNew: false, manifest: null }))
export const reloadAsync = jest.fn(() => Promise.resolve())
export const readLogEntriesAsync = jest.fn(() => Promise.resolve([]))
export const clearLogEntriesAsync = jest.fn(() => Promise.resolve())
