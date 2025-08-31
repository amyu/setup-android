import type {CacheEntry} from '@actions/cache'
import * as core from '@actions/core'
import {saveCache} from './cache'
import * as constants from './constants'
import {INPUT_JOB_STATUS, type Versions} from './constants'
import {renderSummary} from './summary'

async function run(): Promise<void> {
  try {
    if (!isJobStatusSuccess()) {
      return Promise.resolve()
    }

    const sdkVersion = core.getMultilineInput(constants.INPUT_SDK_VERSION)
    const buildToolsVersion = core.getInput(constants.INPUT_BUILD_TOOLS_VERSION)
    const ndkVersion = core.getInput(constants.INPUT_NDK_VERSION)
    const cmakeVersion = core.getInput(constants.INPUT_CMAKE_VERSION)
    const commandLineToolsVersion = core.getInput(
      constants.INPUT_COMMAND_LINE_TOOLS_VERSION
    )
    const cacheDisabled = core.getBooleanInput(constants.INPUT_CACHE_DISABLED)
    const cacheKey = core.getInput(constants.INPUT_CACHE_KEY)
    const generateJobSummary = core.getBooleanInput(
      constants.INPUT_GENERATE_JOB_SUMMARY
    )

    const versions: Versions = {
      sdkVersion,
      buildToolsVersion,
      ndkVersion,
      cmakeVersion,
      commandLineToolsVersion
    }

    let savedCacheEntry: CacheEntry | undefined
    if (!cacheDisabled) {
      core.startGroup('Save Cache')
      savedCacheEntry = await saveCache(versions, cacheKey)
      core.endGroup()
    }

    if (generateJobSummary) {
      await renderSummary(versions, savedCacheEntry)
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
