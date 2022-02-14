import * as core from '@actions/core'
import * as path from 'path'
import {ANDROID_SDK_ROOT} from './constants'

export function addPath(): void {
  core.exportVariable('ANDROID_HOME', ANDROID_SDK_ROOT)
  core.exportVariable('ANDROID_SDK_ROOT', ANDROID_SDK_ROOT)

  // adb ...
  core.addPath(path.join(ANDROID_SDK_ROOT, 'platform-tools'))
}
