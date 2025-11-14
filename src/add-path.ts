import * as path from 'node:path'
import * as core from '@actions/core'
import {ANDROID_SDK_ROOT} from './constants'

export function addPath({
  ndkVersion,
  cmakeVersion
}: {
  ndkVersion?: string
  cmakeVersion?: string
}): void {
  core.exportVariable('ANDROID_SDK_ROOT', ANDROID_SDK_ROOT)
  core.exportVariable('ANDROID_HOME', ANDROID_SDK_ROOT)
  const ndkPath = ndkVersion
    ? path.join(ANDROID_SDK_ROOT, 'ndk', ndkVersion)
    : undefined
  if (ndkPath) {
    core.exportVariable('ANDROID_NDK_ROOT', ndkPath)
    core.exportVariable('ANDROID_NDK_HOME', ndkPath)
    core.exportVariable('ANDROID_NDK', ndkPath)
  }
  if (cmakeVersion) {
    core.exportVariable('CMAKE_VERSION', cmakeVersion)
  }
  core.info('Variables')
  core.info(`  ANDROID_SDK_ROOT: ${ANDROID_SDK_ROOT}`)
  core.info(`  ANDROID_HOME: ${ANDROID_SDK_ROOT}`)
  if (ndkPath) {
    core.info(`  ANDROID_NDK_ROOT: ${ndkPath}`)
    core.info(`  ANDROID_NDK_HOME: ${ndkPath}`)
    core.info(`  ANDROID_NDK: ${ndkPath}`)
  }
  if (cmakeVersion) {
    core.info(`  CMAKE_VERSION: ${cmakeVersion}`)
  }
  core.addPath(path.join(ANDROID_SDK_ROOT, 'platform-tools'))
  core.addPath(path.join(ANDROID_SDK_ROOT, 'ndk-bundle'))
  core.addPath(path.join(ANDROID_SDK_ROOT, 'cmdline-tools', 'latest', 'bin'))
  core.info('Path')
  core.info(`  ${path.join(ANDROID_SDK_ROOT, 'platform-tools')}`)
  core.info(`  ${path.join(ANDROID_SDK_ROOT, 'ndk-bundle')}`)
  core.info(
    `  ${path.join(ANDROID_SDK_ROOT, 'cmdline-tools', 'latest', 'bin')}`
  )
}
