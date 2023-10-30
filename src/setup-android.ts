import * as constants from './constants'
import * as core from '@actions/core'
import {addPath} from './add-path'
import {getAndroidSdk} from './installer'

async function run(): Promise<void> {
  try {
    const sdkVersion = core.getMultilineInput(constants.INPUT_SDK_VERSION)
    const buildToolsVersion = core.getInput(constants.INPUT_BUILD_TOOLS_VERSION)
    const ndkVersion = core.getInput(constants.INPUT_NDK_VERSION)
    const cmakeVersion = core.getInput(constants.INPUT_CMAKE_VERSION)
    const cacheDisabled = core.getBooleanInput(constants.INPUT_CACHE_DISABLED)
    const cacheKey = core.getInput(constants.INPUT_CACHE_KEY)

    core.info(`sdk-version: ${sdkVersion}`)
    core.info(`build-tools-version: ${buildToolsVersion}`)
    core.info(`ndk-version: ${ndkVersion}`)
    core.info(`cmake-version: ${cmakeVersion}`)
    core.info(`cache-disabled: ${cacheDisabled}`)
    core.info(`cache-key: ${cacheKey}`)

    addPath()

    await getAndroidSdk(
      sdkVersion,
      buildToolsVersion,
      ndkVersion,
      cmakeVersion,
      cacheDisabled,
      cacheKey
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
