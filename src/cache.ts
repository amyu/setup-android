import * as cache from '@actions/cache'
import {type CacheEntry, ReserveCacheError} from '@actions/cache'
import * as core from '@actions/core'
import {ANDROID_HOME_DIR} from './constants'

const RESTORED_ENTRY_STATE_KEY = 'restoredEntry'

function simpleHash(str: string): string {
  let hash = 0
  if (str.length === 0) return hash.toString(16)

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16).substring(0, 8)
}

function generateRestoreKey(
  sdkVersion: string[],
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  cacheKey: string
): string {
  const suffixVersion = 'v4'
  // https://github.com/actions/cache/issues/1127
  const dirHash = simpleHash(ANDROID_HOME_DIR)

  const baseKey = cacheKey
    ? `${cacheKey}-${dirHash}-${suffixVersion}`
    : `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}-${dirHash}-${suffixVersion}`

  // cache keys can't contain `,`
  return baseKey.replace(/,/g, '').toLowerCase()
}

export async function restoreCache(
  sdkVersion: string[],
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  cacheKey: string
): Promise<CacheEntry | undefined> {
  const restoreKey = generateRestoreKey(
    sdkVersion,
    buildToolsVersion,
    ndkVersion,
    cmakeVersion,
    cacheKey
  )

  const restoredEntry = await cache.restoreCache([ANDROID_HOME_DIR], restoreKey)
  if (restoredEntry) {
    core.info(`Found in cache: ${restoreKey}`)
  } else {
    core.info(`Not Found cache: ${restoreKey}`)
  }
  core.saveState(RESTORED_ENTRY_STATE_KEY, restoredEntry)
  return Promise.resolve(restoredEntry)
}

export async function saveCache(
  sdkVersion: string[],
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  cacheKey: string
): Promise<CacheEntry | undefined> {
  const restoreKey = generateRestoreKey(
    sdkVersion,
    buildToolsVersion,
    ndkVersion,
    cmakeVersion,
    cacheKey
  )

  core.info(`checking if "${restoreKey}" is already cached ...`)
  core.info(`cacheDir: ${ANDROID_HOME_DIR}`)
  const hasEntry = await cache.restoreCache(
    [ANDROID_HOME_DIR],
    restoreKey,
    [],
    {lookupOnly: true}
  )
  if (hasEntry) {
    core.info(`Found in cache: ${restoreKey}`)
    return
  }

  core.info(`caching "${restoreKey}" ...`)
  try {
    const savedEntry = await cache.saveCache([ANDROID_HOME_DIR], restoreKey)
    return Promise.resolve(savedEntry)
  } catch (error) {
    if (error instanceof ReserveCacheError) {
      core.info(error.message)
    }
  }
}

export function getRestoredEntry(): CacheEntry | undefined {
  const restoredEntryJson = core.getState(RESTORED_ENTRY_STATE_KEY)
  if (restoredEntryJson) {
    return JSON.parse(restoredEntryJson)
  }
}
