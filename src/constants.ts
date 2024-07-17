import * as os from 'node:os'
import path from 'node:path'

export const INPUT_SDK_VERSION = 'sdk-version'
export const INPUT_BUILD_TOOLS_VERSION = 'build-tools-version'
export const INPUT_NDK_VERSION = 'ndk-version'
export const INPUT_CMAKE_VERSION = 'cmake-version'
export const INPUT_CACHE_DISABLED = 'cache-disabled'
export const INPUT_CACHE_KEY = 'cache-key'

export const INPUT_GENERATE_JOB_SUMMARY = 'generate-job-summary'
export const INPUT_JOB_STATUS = 'job-status'

// https://developer.android.com/studio#command-tools
export const COMMANDLINE_TOOLS_LINUX_URL =
  'https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip'
export const COMMANDLINE_TOOLS_MAC_URL =
  'https://dl.google.com/android/repository/commandlinetools-mac-10406996_latest.zip'
export const COMMANDLINE_TOOLS_WINDOWS_URL =
  'https://dl.google.com/android/repository/commandlinetools-win-10406996_latest.zip'

export const HOME = os.homedir()
// github hosted runnerのubuntu-latestではすでにandroid directoryが存在しているため.をつけて回避
export const ANDROID_HOME_DIR = path.join(HOME, '.android')

// https://developer.android.com/studio/command-line/variables
export const ANDROID_SDK_ROOT = path.join(ANDROID_HOME_DIR, 'sdk')
