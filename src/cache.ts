import * as core from '@actions/core'
import * as cache from '@actions/cache'
import {ANDROID_HOME_DIR} from './constants'
import {CacheEntry} from '@actions/cache'

const RESTORED_ENTRY_STATE_KEY = 'restoredEntry'

function generateRestoreKey(
  sdkVersion: string,
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  cacheKey: string
): string {
  if (cacheKey) return cacheKey
  return `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}-v3.2`
}

export async function restoreCache(
  sdkVersion: string,
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
  sdkVersion: string,
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
  return await cache.saveCache([ANDROID_HOME_DIR], restoreKey)
}

export function getRestoredEntry(): CacheEntry | undefined {
  const restoredEntryJson = core.getState(RESTORED_ENTRY_STATE_KEY)
  if (restoredEntryJson) {
    return JSON.parse(restoredEntryJson)
  }
}
