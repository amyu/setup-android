import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as toolCache from '@actions/tool-cache'
import {
  ANDROID_SDK_ROOT,
  COMMANDLINE_TOOLS_LINUX_URL,
  COMMANDLINE_TOOLS_MAC_URL,
  COMMANDLINE_TOOLS_WINDOWS_URL
} from './constants'
import {restoreCache} from './cache'

export async function getAndroidSdk(
  sdkVersion: string[],
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string,
  cacheDisabled: boolean,
  cacheKey: string
): Promise<void> {
  if (!cacheDisabled) {
    const restoreCacheEntry = await restoreCache(
      sdkVersion,
      buildToolsVersion,
      ndkVersion,
      cmakeVersion,
      cacheKey
    )
    if (restoreCacheEntry) {
      core.info(`cache hit: ${restoreCacheEntry.key}`)
      return Promise.resolve()
    }
  }

  await fs.mkdir(ANDROID_SDK_ROOT, {recursive: true})
  core.info(`success create directory`)

  // download sdk-tools
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
  core.info(`start download cmdline-tools url: ${cmdlineToolsDownloadUrl}`)
  const downloadedCmdlineToolsPath = await toolCache.downloadTool(
    cmdlineToolsDownloadUrl
  )
  core.info(
    `success download cmdline-tools path: ${downloadedCmdlineToolsPath}`
  )
  core.info(`start extract cmdline-tools.zip`)
  const extractedCmdlineToolPath = await toolCache.extractZip(
    downloadedCmdlineToolsPath,
    path.join(ANDROID_SDK_ROOT, 'cmdline-tools')
  )
  core.info(
    `success extract cmdline-tools.zip path: ${extractedCmdlineToolPath}`
  )
  if (process.platform === 'win32') {
    await exec.exec(
      `cmd /c "rename ${path.join(
        extractedCmdlineToolPath,
        'cmdline-tools'
      )} latest"`
    )
  } else {
    await fs.mkdir(path.join(ANDROID_SDK_ROOT, 'cmdline-tools', 'latest'), {
      recursive: true
    })
    await fs.rename(
      path.join(extractedCmdlineToolPath, 'cmdline-tools'),
      path.join(ANDROID_SDK_ROOT, 'cmdline-tools', 'latest')
    )
  }

  // install android sdk
  core.info(`installing ...`)
  // https://github.com/actions/toolkit/issues/359 pipes workaround
  switch (process.platform) {
    case 'win32':
      await exec.exec(`cmd /c "yes | sdkmanager --licenses"`)
      break
    case 'darwin':
      await exec.exec(`/bin/bash -c "yes | sdkmanager --licenses"`)
      break
    case 'linux':
      await exec.exec(`/bin/bash -c "yes | sdkmanager --licenses"`)
      break
    default:
      throw Error(`Unsupported platform: ${process.platform}`)
  }

  const sdkVersionCommand = sdkVersion.map(
    version => `platforms;android-${version}`
  )
  await exec.exec('sdkmanager', [
    `build-tools;${buildToolsVersion}`,
    `platform-tools`,
    ...sdkVersionCommand,
    '--verbose'
  ])

  if (cmakeVersion) {
    await exec.exec('sdkmanager', [`cmake;${cmakeVersion}`, '--verbose'])
  }
  if (ndkVersion) {
    await exec.exec('sdkmanager', [`ndk;${ndkVersion}`, '--verbose'])
  }
  core.info(`installed`)
}
