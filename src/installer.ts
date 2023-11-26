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

export async function installAndroidSdk(
  sdkVersion: string[],
  buildToolsVersion: string,
  ndkVersion: string,
  cmakeVersion: string
): Promise<void> {
  await fs.rm(ANDROID_SDK_ROOT, {recursive: true, force: true})
  await fs.rm(path.join(ANDROID_SDK_ROOT, 'cmdline-tools', 'latest'), {
    recursive: true,
    force: true
  })
  core.info(`success cleanup`)

  await fs.mkdir(ANDROID_SDK_ROOT, {recursive: true})
  core.info(`success create directory`)

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

  const from = path.join(extractedCmdlineToolPath, 'cmdline-tools')
  const to = `latest`
  core.info(`start rename ${from} to ${to}`)
  if (process.platform === 'win32') {
    await exec.exec(`cmd /c "rename ${from} ${to}"`)
  } else {
    await fs.mkdir(path.join(ANDROID_SDK_ROOT, 'cmdline-tools', to), {
      recursive: true
    })
    await fs.rename(from, path.join(ANDROID_SDK_ROOT, 'cmdline-tools', to))
  }
  core.info(`success rename ${from} to ${to}`)

  core.info(`start accept licenses`)
  // https://github.com/actions/toolkit/issues/359 pipes workaround
  switch (process.platform) {
    case 'win32':
      await exec.exec(`cmd /c "yes | sdkmanager --licenses"`, [], {
        silent: !core.isDebug()
      })
      break
    case 'darwin':
      await exec.exec(`/bin/bash -c "yes | sdkmanager --licenses"`, [], {
        silent: !core.isDebug()
      })
      break
    case 'linux':
      await exec.exec(`/bin/bash -c "yes | sdkmanager --licenses"`, [], {
        silent: !core.isDebug()
      })
      break
    default:
      throw Error(`Unsupported platform: ${process.platform}`)
  }
  core.info(`success accept licenses`)

  core.info(
    `start install build-tools:${buildToolsVersion} and platform-tools and skd:${sdkVersion}`
  )
  const sdkVersionCommand = sdkVersion.map(
    version => `platforms;android-${version}`
  )
  await exec.exec(
    'sdkmanager',
    [
      `build-tools;${buildToolsVersion}`,
      `platform-tools`,
      ...sdkVersionCommand,
      '--verbose'
    ],
    {silent: !core.isDebug()}
  )
  core.info(
    `success install build-tools:${buildToolsVersion} and platform-tools and skd:${sdkVersion}`
  )

  if (cmakeVersion) {
    core.info(`start install cmake:${cmakeVersion}`)
    await exec.exec('sdkmanager', [`cmake;${cmakeVersion}`, '--verbose'], {
      silent: !core.isDebug()
    })
    core.info(`success install cmake:${cmakeVersion}`)
  }
  if (ndkVersion) {
    core.info(`start install ndk:${ndkVersion}`)
    await exec.exec('sdkmanager', [`ndk;${ndkVersion}`, '--verbose'], {
      silent: !core.isDebug()
    })
    core.info(`success install ndk:${ndkVersion}`)
  }
}
