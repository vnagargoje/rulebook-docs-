/**
 * Common utility functions for the yugo project.
 */

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export * from './types'
