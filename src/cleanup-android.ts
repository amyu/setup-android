import * as constants from './constants'
import * as core from '@actions/core'
import {saveCache} from './cache'
import {renderSummary} from './summary'
import {INPUT_JOB_STATUS} from './constants'

async function run(): Promise<void> {
  try {
    if (!isJobStatusSuccess()) {
      return Promise.resolve()
    }

    const sdkVersion = core.getInput(constants.INPUT_SDK_VERSION)
    const buildToolsVersion = core.getInput(constants.INPUT_BUILD_TOOLS_VERSION)
    const ndkVersion = core.getInput(constants.INPUT_NDK_VERSION)
    const cmakeVersion = core.getInput(constants.INPUT_CMAKE_VERSION)
    const cacheDisabled = core.getInput(constants.INPUT_CACHE_DISABLED)

    if (!cacheDisabled) {
      const savedCacheEntry = await saveCache(
        sdkVersion,
        buildToolsVersion,
        ndkVersion,
        cmakeVersion
      )
      await renderSummary(
        sdkVersion,
        buildToolsVersion,
        ndkVersion,
        cmakeVersion,
        savedCacheEntry
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export function isJobStatusSuccess(): boolean {
  const jobStatus = core.getInput(INPUT_JOB_STATUS)

  return jobStatus === 'success'
}

run()
