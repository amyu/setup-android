import * as path from 'node:path'
import * as core from '@actions/core'
import {ANDROID_SDK_ROOT} from './constants'

export function addPath({ndkVersion}: {ndkVersion?: string}): void {
  core.exportVariable('ANDROID_SDK_ROOT', ANDROID_SDK_ROOT)
  core.exportVariable('ANDROID_HOME', ANDROID_SDK_ROOT)
  if (ndkVersion) {
    core.exportVariable(
      'ANDROID_NDK_ROOT',
      path.join(ANDROID_SDK_ROOT, 'ndk', ndkVersion)
    )
  }
  core.info('Variables')
  core.info(`  ANDROID_SDK_ROOT: ${ANDROID_SDK_ROOT}`)
  core.info(`  ANDROID_HOME: ${ANDROID_SDK_ROOT}`)
  if (ndkVersion) {
    core.info(
      `  ANDROID_NDK_ROOT: ${path.join(ANDROID_SDK_ROOT, 'ndk', ndkVersion)}`
    )
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
