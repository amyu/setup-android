import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {
  ANDROID_HOME_DIR,
  ANDROID_SDK_ROOT,
  COMMANDLINE_TOOLS_LINUX_URL
} from './constants'
import {execSync} from 'child_process'

export async function getAndroidSdk(sdkVersion: string): Promise<void> {
  const cachePath = tc.find('android', sdkVersion)

  if (cachePath) {
    core.info(`Found in cache @ ${cachePath}`)
    core.addPath(cachePath)

    return Promise.resolve()
  }

  // download sdk-tools
  core.info(`downloading cmdline-tools ...`)
  execSync(`mkdir -p ${ANDROID_SDK_ROOT}`, {stdio: 'inherit'})
  execSync(`curl -o cmdline-tools.zip ${COMMANDLINE_TOOLS_LINUX_URL}`, {
    stdio: 'inherit'
  })
  execSync(`unzip "cmdline-tools.zip" -d ${ANDROID_SDK_ROOT}`, {
    stdio: 'inherit'
  })
  core.info(`downloaded cmdline-tools`)

  // install android sdk
  core.info(`installing ...`)
  execSync(
    `yes | ${ANDROID_SDK_ROOT}/cmdline-tools/bin/sdkmanager --licenses --sdk_root=${ANDROID_SDK_ROOT}`,
    {
      stdio: 'inherit'
    }
  )
  execSync(
    `${ANDROID_SDK_ROOT}/cmdline-tools/bin/sdkmanager "build-tools;30.0.3" "platform-tools" "platforms;android-${sdkVersion}" --sdk_root=${ANDROID_SDK_ROOT}`,
    {
      stdio: 'inherit'
    }
  )
  core.info(`installed`)

  // add cache
  core.info(`caching ...`)
  const cachedPath = await tc.cacheDir(ANDROID_HOME_DIR, 'android', sdkVersion)
  core.addPath(cachedPath)
  core.info(`cached ${cachedPath}`)
}
