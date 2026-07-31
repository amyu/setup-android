import * as os from "node:os";
import path from "node:path";

export const INPUT_SDK_VERSION = "sdk-version";
export const INPUT_BUILD_TOOLS_VERSION = "build-tools-version";
export const INPUT_NDK_VERSION = "ndk-version";
export const INPUT_CMAKE_VERSION = "cmake-version";
export const INPUT_COMMAND_LINE_TOOLS_VERSION = "command-line-tools-version";
export const INPUT_CACHE_DISABLED = "cache-disabled";
export const INPUT_CACHE_KEY = "cache-key";

export const INPUT_GENERATE_JOB_SUMMARY = "generate-job-summary";
export const INPUT_JOB_STATUS = "job-status";

// https://developer.android.com/studio#command-tools
const MACOS_ARCH_SPECIFIC_COMMAND_LINE_TOOLS_VERSION = 15859902;

export const COMMANDLINE_TOOLS_LINUX_URL = (version: string) =>
  `https://dl.google.com/android/repository/commandlinetools-linux-${version}_latest.zip`;
export const COMMANDLINE_TOOLS_MAC_URL = (
  version: string,
  architecture: NodeJS.Architecture = process.arch,
) => {
  // macOS archives became architecture-specific starting with this release.
  if (Number(version) >= MACOS_ARCH_SPECIFIC_COMMAND_LINE_TOOLS_VERSION) {
    switch (architecture) {
      case "arm64":
        return `https://dl.google.com/android/repository/commandlinetools-mac_arm64-${version}_latest.zip`;
      case "x64":
        return `https://dl.google.com/android/repository/commandlinetools-mac_x86_64-${version}_latest.zip`;
      default:
        throw new Error(`Unsupported macOS architecture: ${architecture}`);
    }
  }

  return `https://dl.google.com/android/repository/commandlinetools-mac-${version}_latest.zip`;
};
export const COMMANDLINE_TOOLS_WINDOWS_URL = (version: string) =>
  `https://dl.google.com/android/repository/commandlinetools-win-${version}_latest.zip`;

export const HOME = os.homedir();
// Avoid the existing Android directory on GitHub-hosted Ubuntu runners.
export const ANDROID_HOME_DIR = path.join(HOME, ".android");

// https://developer.android.com/studio/command-line/variables
export const ANDROID_SDK_ROOT = path.join(ANDROID_HOME_DIR, "sdk");

export type Versions = {
  sdkVersion: string[];
  buildToolsVersion: string[];
  ndkVersion: string;
  cmakeVersion: string;
  commandLineToolsVersion: string;
};
