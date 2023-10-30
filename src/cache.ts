import * as core from '@actions/core'
import * as cache from '@actions/cache'
import {ANDROID_HOME_DIR} from './constants'
import {CacheEntry, ReserveCacheError} from '@actions/cache'

const RESTORED_ENTRY_STATE_KEY = 'restoredEntry'

function generateRestoreKey(
  sdkVersion: string[],
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  cacheKey: string
): string {
  const suffixVersion = 'v3.4'
  if (cacheKey) return `${cacheKey}-${suffixVersion}`
  return (
    `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}-${suffixVersion}`
      // cache keys can't contain `,`
      .replace(/,/g, '')
      .toLowerCase()
  )
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
