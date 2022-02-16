import * as os from 'os'
import path from 'path'

export const INPUT_SDK_VERSION = 'sdk-version'
export const INPUT_BUILD_TOOLS_VERSION = 'build-tools-version'
export const INPUT_NDK_VERSION = 'ndk-version'
export const INPUT_CMAKE_VERSION = 'cmake-version'
export const INPUT_IS_USE_CACHE = 'is-use-cache'

// https://developer.android.com/studio#command-tools
export const COMMANDLINE_TOOLS_LINUX_URL = `https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip`
export const COMMANDLINE_TOOLS_MAC_URL = `https://dl.google.com/android/repository/commandlinetools-mac-8092744_latest.zip`
export const COMMANDLINE_TOOLS_WINDOWS_URL = `https://dl.google.com/android/repository/commandlinetools-win-8092744_latest.zip`

export const HOME = os.homedir()
// github hosted runnerのubuntu-latestではすでにandroid directoryが存在しているため.をつけて回避
export const ANDROID_HOME_DIR = path.join(HOME, '.android')

// https://developer.android.com/studio/command-line/variables
export const ANDROID_SDK_ROOT = path.join(ANDROID_HOME_DIR, 'sdk')
