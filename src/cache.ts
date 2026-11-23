import * as cache from "@actions/cache";
import { type CacheEntry, ReserveCacheError } from "@actions/cache";
import * as core from "@actions/core";

import { ANDROID_SDK_ROOT } from "./constants.js";

const RESTORED_ENTRY_STATE_KEY = "restoredEntry";

export async function restoreCache(restoreKey: string): Promise<CacheEntry | undefined> {
  const restoredEntry = await cache.restoreCache([ANDROID_SDK_ROOT], restoreKey);
  if (restoredEntry) {
    core.info(`Found in cache: ${restoreKey}`);
  } else {
    core.info(`Not Found cache: ${restoreKey}`);
  }
  core.saveState(RESTORED_ENTRY_STATE_KEY, restoredEntry);
  return Promise.resolve(restoredEntry);
}

export async function saveCache(restoreKey: string): Promise<CacheEntry | undefined> {
  core.info(`checking if "${restoreKey}" is already cached ...`);
  core.info(`cacheDir: ${ANDROID_SDK_ROOT}`);
  const hasEntry = await cache.restoreCache([ANDROID_SDK_ROOT], restoreKey, [], {
    lookupOnly: true,
  });
  if (hasEntry) {
    core.info(`Found in cache: ${restoreKey}`);
    return undefined;
  }

  core.info(`caching "${restoreKey}" ...`);
  try {
    const savedEntry = await cache.saveCache([ANDROID_SDK_ROOT], restoreKey);
    return Promise.resolve(savedEntry);
  } catch (error) {
    if (error instanceof ReserveCacheError) {
      core.info(error.message);
    }
  }
  return undefined;
}

export function getRestoredEntry(): CacheEntry | undefined {
  const restoredEntryJson = core.getState(RESTORED_ENTRY_STATE_KEY);
  if (restoredEntryJson) {
    return JSON.parse(restoredEntryJson);
  }
  return undefined;
}
