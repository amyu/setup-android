import * as constants from './constants'
import * as core from '@actions/core'
import {addPath} from './add-path'
import {getAndroidSdk} from './installer'

async function run(): Promise<void> {
  try {
    const sdkVersion = core.getInput(constants.INPUT_SDK_VERSION, {
      required: true
    })

    core.info(`sdk-version: ${sdkVersion}`)

    if (!sdkVersion) {
      core.setFailed('not found sdk-version')
      return
    }

    await getAndroidSdk(sdkVersion)

    addPath()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
