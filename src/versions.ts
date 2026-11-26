import * as core from "@actions/core";

import checksums from "./command-line-tools-checksums.json" with { type: "json" };
import * as constants from "./constants.js";
import { validateNdkVersion } from "./ndk.js";
import { normalizeSdkVersions } from "./sdk-version.js";

const archiveChecksums: Readonly<Record<string, string>> = checksums;

function commandLineToolsArchive(version: string) {
  if (!/^\d+$/.test(version)) {
    throw new Error("command-line-tools-version must be a numeric build number.");
  }
  let url: string;
  switch (process.platform) {
    case "win32":
      url = constants.COMMANDLINE_TOOLS_WINDOWS_URL(version);
      break;
    case "darwin":
      url = constants.COMMANDLINE_TOOLS_MAC_URL(version);
      break;
    case "linux":
      url = constants.COMMANDLINE_TOOLS_LINUX_URL(version);
      break;
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }

  const pinned = archiveChecksums[url.slice(url.lastIndexOf("/") + 1)];
  const supplied = core.getInput("command-line-tools-sha256").toLowerCase();
  if (supplied && (!/^[0-9a-f]{64}$/.test(supplied) || (pinned && supplied !== pinned))) {
    throw new Error(
      "command-line-tools-sha256 must be a valid SHA-256 matching the selected archive.",
    );
  }
  const sha256 = pinned || supplied;
  if (!sha256) {
    throw new Error(`No pinned checksum for ${url}. Supply its trusted command-line-tools-sha256.`);
  }
  return { url, sha256 };
}

export function readVersions(warn?: (message: string) => void): constants.Versions {
  const ndkVersion = core.getInput(constants.INPUT_NDK_VERSION);
  validateNdkVersion(ndkVersion);
  const commandLineToolsVersion = core.getInput(constants.INPUT_COMMAND_LINE_TOOLS_VERSION);
  return {
    sdkVersion: normalizeSdkVersions(core.getMultilineInput(constants.INPUT_SDK_VERSION), { warn }),
    buildToolsVersion: core.getMultilineInput(constants.INPUT_BUILD_TOOLS_VERSION),
    ndkVersion,
    cmakeVersion: core.getInput(constants.INPUT_CMAKE_VERSION),
    commandLineToolsVersion,
    commandLineToolsArchive: commandLineToolsArchive(commandLineToolsVersion),
  };
}
