import {SUMMARY_ENV_VAR} from '@actions/core/lib/summary'
import * as core from '@actions/core'
import {getRestoredEntry} from './cache'
import {CacheEntry} from '@actions/cache'

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
  core.summary.addRaw(`
<table>
    <tr>
        <th>SDK</th>
        <th>Build Tools</th>
        <th>NDK</th>
        <th>Cmake</th>
    </tr>
    <tr>
      <td>${sdkVersion}</td>
      <td>${buildToolsVersion}</td>
      <td>${ndkVersion}</td>
      <td>${cmakeVersion}</td>
  </tr>
</table>
    `)

  const restoredCacheEntry = getRestoredEntry()
  core.summary.addHeading('Cached Summary', 3)
  if (savedCacheEntry) {
    core.summary.addRaw(`save cache key: \`${savedCacheEntry.key}\``)
  } else {
    core.summary.addRaw(`Not saved cache`)
  }
  core.summary.addBreak()
  if (restoredCacheEntry) {
    core.summary.addRaw(`restore cache key: \`${restoredCacheEntry.key}\``)
  } else {
    core.summary.addRaw(`Not restored cache`)
  }

  core.summary.addRaw(`
<table>
    <tr>
        <th>Cached size</th>
        <th>Restored size</th>
    </tr>
    <tr>
      <td>${formatSize(savedCacheEntry?.size)}</td>
      <td>${formatSize(restoredCacheEntry?.size)}</td>
  </tr>
</table>
    `)
  await core.summary.write()
}

function formatSize(bytes: number | undefined): string {
  if (bytes === undefined || bytes === 0) {
    return 'X'
  }
  return `${Math.round(bytes / (1024 * 1024))} MB (${bytes} B)`
}
