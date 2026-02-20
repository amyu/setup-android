import type {CacheEntry} from '@actions/cache'
import * as core from '@actions/core'
import {getRestoredEntry} from './cache.js'
import type {Versions} from './constants.js'

const SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY'

export async function renderSummary(
  versions: Versions,
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
      {data: 'Cmake', header: true},
      {data: 'Command Line Tools', header: true}
    ],
    [
      versions.sdkVersion.join(', '),
      versions.buildToolsVersion.join(', '),
      versions.ndkVersion,
      versions.cmakeVersion,
      versions.commandLineToolsVersion
    ]
  ])

  const restoredCacheEntry = getRestoredEntry()
  core.summary.addHeading('Cached Summary', 3)
  if (savedCacheEntry) {
    core.summary.addRaw(
      `save cache key: <code>${savedCacheEntry.key}</code>`,
      true
    )
  } else {
    core.summary.addRaw('Not saved cache', true)
  }
  core.summary.addBreak()
  if (restoredCacheEntry) {
    core.summary.addRaw(
      `restore cache key: <code>${restoredCacheEntry.key}</code>`,
      true
    )
  } else {
    core.summary.addRaw('Not restored cache', true)
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
