import * as cache from '@actions/cache'
import * as core from '@actions/core'
import {
  ANDROID_HOME_DIR,
  ANDROID_SDK_ROOT,
  COMMANDLINE_TOOLS_LINUX_URL
} from './constants'
import {ReserveCacheError} from '@actions/cache'
import {execSync} from 'child_process'

export async function getAndroidSdk(
  sdkVersion: string,
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  isUseCache: boolean
): Promise<void> {
  if (isUseCache) {
    const matchedKey = await cache.restoreCache(
      [ANDROID_HOME_DIR],
      'CACHE_KEY',
      [sdkVersion]
    )
    if (matchedKey) {
      core.info(`Found in cache`)
      return Promise.resolve()
    }
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
    `${ANDROID_SDK_ROOT}/cmdline-tools/bin/sdkmanager "build-tools;${buildToolsVersion}" "platform-tools" "platforms;android-${sdkVersion}" --sdk_root=${ANDROID_SDK_ROOT}`,
    {
      stdio: 'inherit'
    }
  )
  if (ndkVersion) {
    execSync(
      `${ANDROID_SDK_ROOT}/cmdline-tools/bin/sdkmanager "ndk;${ndkVersion}" --sdk_root=${ANDROID_SDK_ROOT}`,
      {
        stdio: 'inherit'
      }
    )
  }
  if (cmakeVersion) {
    execSync(
      `${ANDROID_SDK_ROOT}/cmdline-tools/bin/sdkmanager "cmake;${cmakeVersion}" --sdk_root=${ANDROID_SDK_ROOT}`,
      {
        stdio: 'inherit'
      }
    )
  }
  core.info(`installed`)

  // add cache
  core.info(`caching ...`)
  try {
    await cache.saveCache([ANDROID_HOME_DIR], sdkVersion)
  } catch (error) {
    // 同じKeyで登録してもOK
    if (error instanceof ReserveCacheError) {
      core.info(error.message)
    }
  }
  core.info(`cached`)
}
