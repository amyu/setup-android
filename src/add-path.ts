import * as core from '@actions/core'
import * as path from 'path'
import {ANDROID_SDK_ROOT} from './constants'

export function addPath(): void {
  core.exportVariable('ANDROID_SDK_ROOT', ANDROID_SDK_ROOT)
  core.exportVariable('ANDROID_HOME', ANDROID_SDK_ROOT)
  core.info('Variables')
  core.info(`  ANDROID_SDK_ROOT: ${ANDROID_SDK_ROOT}`)
  core.info(`  ANDROID_HOME: ${ANDROID_SDK_ROOT}`)

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
