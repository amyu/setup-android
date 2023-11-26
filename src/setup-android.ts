import * as constants from './constants'
import * as core from '@actions/core'
import {addPath} from './add-path'
import {installAndroidSdk} from './installer'
import {restoreCache} from './cache'

async function run(): Promise<void> {
  try {
    const sdkVersion = core.getMultilineInput(constants.INPUT_SDK_VERSION)
    const buildToolsVersion = core.getInput(constants.INPUT_BUILD_TOOLS_VERSION)
    const ndkVersion = core.getInput(constants.INPUT_NDK_VERSION)
    const cmakeVersion = core.getInput(constants.INPUT_CMAKE_VERSION)
    const cacheDisabled = core.getBooleanInput(constants.INPUT_CACHE_DISABLED)
    const cacheKey = core.getInput(constants.INPUT_CACHE_KEY)

    core.startGroup('Environment details for Android SDK')
    addPath()
    core.endGroup()

    if (!cacheDisabled) {
      core.startGroup('Restored Android SDK from Cache')
      const restoreCacheEntry = await restoreCache(
        sdkVersion,
        buildToolsVersion,
        ndkVersion,
        cmakeVersion,
        cacheKey
      )
      core.endGroup()
      if (restoreCacheEntry) {
        return Promise.resolve()
      }
    }

    core.startGroup('Installed Android SDK')
    await installAndroidSdk(
      sdkVersion,
      buildToolsVersion,
      ndkVersion,
      cmakeVersion
    )
    core.endGroup()
  } catch (error) {
    core.info(
      `To see the logs executed by sdkmanager, set ACTIONS_STEP_DEBUG to true`
    )
    core.info(
      `https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging`
    )
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
