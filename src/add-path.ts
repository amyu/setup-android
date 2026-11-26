import * as path from "node:path";

import * as core from "@actions/core";

import { ANDROID_SDK_ROOT } from "./constants.js";
import { installedNdkPath } from "./ndk.js";

export async function addPath({
  ndkVersion,
  cmakeVersion,
}: {
  ndkVersion?: string;
  cmakeVersion?: string;
}): Promise<void> {
  const ndkPath = ndkVersion ? await installedNdkPath(ANDROID_SDK_ROOT, ndkVersion) : undefined;
  if (ndkPath) {
    core.exportVariable("ANDROID_NDK_ROOT", ndkPath);
    core.exportVariable("ANDROID_NDK_HOME", ndkPath);
    core.exportVariable("ANDROID_NDK", ndkPath);
  }
  if (cmakeVersion) {
    core.exportVariable("CMAKE_VERSION", cmakeVersion);
  }
  core.info("Variables");
  core.info(`  ANDROID_SDK_ROOT: ${ANDROID_SDK_ROOT}`);
  core.info(`  ANDROID_HOME: ${ANDROID_SDK_ROOT}`);
  if (ndkPath) {
    core.info(`  ANDROID_NDK_ROOT: ${ndkPath}`);
    core.info(`  ANDROID_NDK_HOME: ${ndkPath}`);
    core.info(`  ANDROID_NDK: ${ndkPath}`);
  }
  if (cmakeVersion) {
    core.info(`  CMAKE_VERSION: ${cmakeVersion}`);
  }
  if (ndkPath) {
    core.addPath(ndkPath);
  }
  core.addPath(path.join(ANDROID_SDK_ROOT, "platform-tools"));
  core.addPath(path.join(ANDROID_SDK_ROOT, "cmdline-tools", "latest", "bin"));
  core.info("Path");
  if (ndkPath) {
    core.info(`  ${ndkPath}`);
  }
  core.info(`  ${path.join(ANDROID_SDK_ROOT, "platform-tools")}`);
  core.info(`  ${path.join(ANDROID_SDK_ROOT, "cmdline-tools", "latest", "bin")}`);
}
