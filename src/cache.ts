import * as core from '@actions/core'
import * as cache from '@actions/cache'
import {ANDROID_HOME_DIR} from './constants'
import {CacheEntry, ReserveCacheError} from '@actions/cache'

const RESTORED_ENTRY_STATE_KEY = 'restoredEntry'
const SAVED_ENTRY_STATE_KEY = 'savedEntry'

function generateRestoreKey(
  sdkVersion: string,
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string
): string {
  return `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}-2`
}

export async function restoreCache(
  sdkVersion: string,
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string
): Promise<CacheEntry | undefined> {
  const restoreKey = generateRestoreKey(
    sdkVersion,
    buildToolsVersion,
    ndkVersion,
    cmakeVersion
  )

  const restoredEntry = await cache.restoreCache([ANDROID_HOME_DIR], restoreKey)
  if (restoredEntry) {
    core.info(`Found in cache`)
  } else {
    core.info(`Not Found cache`)
  }
  core.saveState(RESTORED_ENTRY_STATE_KEY, restoredEntry)
  return Promise.resolve(restoredEntry)
}

export async function saveCache(
  sdkVersion: string,
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string
): Promise<CacheEntry | undefined> {
  const restoreKey = generateRestoreKey(
    sdkVersion,
    buildToolsVersion,
    ndkVersion,
    cmakeVersion
  )
  core.info(`caching ...`)

  try {
    const savedEntry = await cache.saveCache([ANDROID_HOME_DIR], restoreKey)
    core.saveState(SAVED_ENTRY_STATE_KEY, savedEntry)
    return Promise.resolve(savedEntry)
  } catch (error) {
    // 同じKeyで登録してもOK
    if (error instanceof ReserveCacheError) {
      core.info(error.message)
    }
  }

  core.info(`cached`)
  return Promise.resolve(undefined)
}

export function getRestoredEntry(): CacheEntry | undefined {
  const restoredEntryJson = core.getState(RESTORED_ENTRY_STATE_KEY)
  if (restoredEntryJson) {
    return JSON.parse(core.getState(RESTORED_ENTRY_STATE_KEY))
  }
}

export function getSavedEntry(): CacheEntry | undefined {
  const savedEntryJson = core.getState(SAVED_ENTRY_STATE_KEY)
  if (savedEntryJson) {
    return JSON.parse(savedEntryJson)
  }
}
