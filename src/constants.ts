import * as os from 'os'
import path from 'path'

export const INPUT_SDK_VERSION = 'sdk-version'

// https://developer.android.com/studio#command-tools
export const COMMANDLINE_TOOLS_LINUX_URL = `https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip`

export const HOME = os.homedir()
export const ANDROID_HOME_DIR = path.join(HOME, '.android')

// https://developer.android.com/studio/command-line/variables
export const ANDROID_SDK_ROOT = path.join(ANDROID_HOME_DIR, 'sdk')
