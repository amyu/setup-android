import type {CacheEntry} from '@actions/cache'
import * as core from '@actions/core'
import {SUMMARY_ENV_VAR} from '@actions/core/lib/summary'
import {getRestoredEntry} from './cache'

export async function renderSummary(
  sdkVersion: string[],
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  savedCacheEntry: CacheEntry | undefined
): Promise<void> {
  // is supported job summary
  if (!process.env[SUMMARY_ENV_VAR]) {
    return Promise.resolve()
  }

  core.summary.addHeading('setup-android')
  core.summary.addTable([
    [
      {data: 'SDK', header: true},
      {data: 'Build Tools', header: true},
      {data: 'NDK', header: true},
      {data: 'Cmake', header: true}
    ],
    [sdkVersion.join(', '), buildToolsVersion, ndkVersion, cmakeVersion]
  ])

  const restoredCacheEntry = getRestoredEntry()
  core.summary.addHeading('Cached Summary', 3)
  if (savedCacheEntry) {
    core.summary.addRaw(`save cache key: \`${savedCacheEntry.key}\``)
  } else {
    core.summary.addRaw('Not saved cache')
  }
  core.summary.addBreak()
  if (restoredCacheEntry) {
    core.summary.addRaw(`restore cache key: \`${restoredCacheEntry.key}\``)
  } else {
    core.summary.addRaw('Not restored cache')
  }

  core.summary.addTable([
    [
      {data: 'Cached size', header: true},
      {data: 'Restored size', header: true}
    ],
    [formatSize(savedCacheEntry?.size), formatSize(restoredCacheEntry?.size)]
  ])

  await core.summary.write()
}

function formatSize(bytes: number | undefined): string {
  if (bytes === undefined || bytes === 0) {
    return 'X'
  }
  return `${Math.round(bytes / (1024 * 1024))} MB (${bytes} B)`
}
