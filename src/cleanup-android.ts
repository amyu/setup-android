import * as constants from './constants'
import * as core from '@actions/core'
import * as cache from '@actions/cache'
import {ANDROID_HOME_DIR} from './constants'
import {ReserveCacheError} from '@actions/cache'
import {generateRestoreKey} from './cache'
import {SUMMARY_ENV_VAR} from '@actions/core/lib/summary'

async function run(): Promise<void> {
  try {
    const sdkVersion = core.getInput(constants.INPUT_SDK_VERSION)
    const buildToolsVersion = core.getInput(constants.INPUT_BUILD_TOOLS_VERSION)
    const ndkVersion = core.getInput(constants.INPUT_NDK_VERSION)
    const cmakeVersion = core.getInput(constants.INPUT_CMAKE_VERSION)

    const restoreKey = generateRestoreKey(
      sdkVersion,
      buildToolsVersion,
      ndkVersion,
      cmakeVersion
    )
    core.info(`caching ...`)

    try {
      await cache.saveCache([ANDROID_HOME_DIR], restoreKey)
    } catch (error) {
      // 同じKeyで登録してもOK
      if (error instanceof ReserveCacheError) {
        core.info(error.message)
      }
    }
    core.info(`cached`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
