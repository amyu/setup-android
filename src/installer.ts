import * as cache from '@actions/cache'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as path from 'path'
import * as toolCache from '@actions/tool-cache'
import {
  ANDROID_HOME_DIR,
  ANDROID_SDK_ROOT,
  COMMANDLINE_TOOLS_LINUX_URL,
  COMMANDLINE_TOOLS_MAC_URL,
  COMMANDLINE_TOOLS_WINDOWS_URL
} from './constants'
import {ReserveCacheError} from '@actions/cache'

export async function getAndroidSdk(
  sdkVersion: string,
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  isUseCache: boolean
): Promise<void> {
  const restoreKey = `${sdkVersion}-${buildToolsVersion}-${ndkVersion}-${cmakeVersion}`

  if (isUseCache) {
    const matchedKey = await cache.restoreCache([ANDROID_HOME_DIR], restoreKey)
    if (matchedKey) {
      core.info(`Found in cache`)
      return Promise.resolve()
    }
  }

  // download sdk-tools
  core.info(`downloading cmdline-tools ...`)
  fs.mkdirSync(ANDROID_HOME_DIR, {recursive: true})

  let cmdlineToolsDownloadUrl: string
  switch (process.platform) {
    case 'win32':
      cmdlineToolsDownloadUrl = COMMANDLINE_TOOLS_WINDOWS_URL
      break
    case 'darwin':
      cmdlineToolsDownloadUrl = COMMANDLINE_TOOLS_MAC_URL
      break
    case 'linux':
      cmdlineToolsDownloadUrl = COMMANDLINE_TOOLS_LINUX_URL
      break
    default:
      throw Error(`Unsupported platform: ${process.platform}`)
  }
  const downloadedCmdlineToolsPath = await toolCache.downloadTool(
    cmdlineToolsDownloadUrl
  )
  const extractedCmdlineToolPath = await toolCache.extractZip(
    downloadedCmdlineToolsPath
  )
  core.info(`downloaded cmdline-tools`)

  // install android sdk
  core.info(`installing ...`)
  core.addPath(path.join(extractedCmdlineToolPath, 'bin'))
  await exec.exec(
    'sdkManager',
    [`--licenses`, `--sdk_root=${ANDROID_SDK_ROOT}`],
    {
      input: Buffer.from('y')
    }
  )
  await exec.exec('sdkManager', [
    `"build-tools;${buildToolsVersion}"`,
    `"platform-tools"`,
    `"platforms;android-${sdkVersion}"`,
    `--sdk_root=${ANDROID_SDK_ROOT}`
  ])
  if (ndkVersion) {
    await exec.exec('sdkManager', [
      `"ndk;${ndkVersion}"`,
      `--sdk_root=${ANDROID_SDK_ROOT}`
    ])
  }
  if (cmakeVersion) {
    await exec.exec('sdkManager', [
      `"cmake;${cmakeVersion}"`,
      `--sdk_root=${ANDROID_SDK_ROOT}`
    ])
  }
  core.info(`installed`)

  // add cache
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
}
