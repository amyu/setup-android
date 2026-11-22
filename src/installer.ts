import * as fs from "node:fs/promises";
import * as path from "node:path";

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as toolCache from "@actions/tool-cache";

import {
  ANDROID_SDK_ROOT,
  COMMANDLINE_TOOLS_LINUX_URL,
  COMMANDLINE_TOOLS_MAC_URL,
  COMMANDLINE_TOOLS_WINDOWS_URL,
  type Versions,
} from "./constants.js";

export async function installAndroidSdk(versions: Versions): Promise<void> {
  await fs.rm(ANDROID_SDK_ROOT, { recursive: true, force: true });
  await fs.rm(path.join(ANDROID_SDK_ROOT, "cmdline-tools", "latest"), {
    recursive: true,
    force: true,
  });
  core.info("success cleanup");

  await fs.mkdir(ANDROID_SDK_ROOT, { recursive: true });
  core.info("success create directory");

  let cmdlineToolsDownloadUrl: string;
  switch (process.platform) {
    case "win32":
      cmdlineToolsDownloadUrl = COMMANDLINE_TOOLS_WINDOWS_URL(versions.commandLineToolsVersion);
      break;
    case "darwin":
      cmdlineToolsDownloadUrl = COMMANDLINE_TOOLS_MAC_URL(versions.commandLineToolsVersion);
      break;
    case "linux":
      cmdlineToolsDownloadUrl = COMMANDLINE_TOOLS_LINUX_URL(versions.commandLineToolsVersion);
      break;
    default:
      throw Error(`Unsupported platform: ${process.platform}`);
  }
  core.info(`start download cmdline-tools url: ${cmdlineToolsDownloadUrl}`);
  const downloadedCmdlineToolsPath = await toolCache.downloadTool(cmdlineToolsDownloadUrl);
  core.info(`success download cmdline-tools path: ${downloadedCmdlineToolsPath}`);
  core.info("start extract cmdline-tools.zip");
  const extractedCmdlineToolPath = await toolCache.extractZip(
    downloadedCmdlineToolsPath,
    path.join(ANDROID_SDK_ROOT, "cmdline-tools"),
  );
  core.info(`success extract cmdline-tools.zip path: ${extractedCmdlineToolPath}`);

  const from = path.join(extractedCmdlineToolPath, "cmdline-tools");
  const to = path.join(extractedCmdlineToolPath, "latest");
  core.info(`start rename ${from} to ${to}`);
  await fs.rename(from, to);
  core.info(`success rename ${from} to ${to}`);

  const isWindows = process.platform === "win32";
  const sdkManager = isWindows ? "./sdkmanager.bat" : "./sdkmanager";
  const execOptions = { cwd: path.join(to, "bin"), silent: !core.isDebug() };

  core.info("start accept licenses");
  if (isWindows) {
    await exec.exec(sdkManager, ["--licenses"], {
      ...execOptions,
      input: Buffer.from("y\n".repeat(100)),
    });
  } else {
    await exec.exec("/bin/bash", ["-c", "yes | ./sdkmanager --licenses"], execOptions);
  }
  core.info("success accept licenses");

  const sdkVersionCommand = versions.sdkVersion.map((version) => `platforms;android-${version}`);
  const buildToolsVersionCommand = versions.buildToolsVersion.map(
    (version) => `build-tools;${version}`,
  );
  const packages = [
    ...buildToolsVersionCommand,
    "platform-tools",
    ...sdkVersionCommand,
    "--verbose",
  ];

  if (versions.buildToolsVersion.length > 0) {
    core.info(
      `start install build-tools:${versions.buildToolsVersion.join(",")} and platform-tools and sdk:${versions.sdkVersion.join(",")}`,
    );
  } else {
    core.info(
      `start install platform-tools and sdk:${versions.sdkVersion.join(",")} (build-tools skipped)`,
    );
  }
  try {
    await exec.exec(sdkManager, packages, execOptions);
  } catch (error) {
    const codenamePackages = versions.sdkVersion
      .filter((version) => !/^\d+(?:\.\d+)?$/.test(version))
      .map((version) => `"platforms;android-${version}"`);

    if (codenamePackages.length === 0) {
      throw error;
    }

    const originalError = error instanceof Error ? ` Original error: ${error.message}` : "";
    throw new Error(
      "sdkmanager failed while installing packages that include the " +
        `codename-based Android SDK platform ${codenamePackages.join(", ")}. ` +
        "Codename values are supported when their exact package IDs are " +
        'published by SDK Manager. Verify the ID with "sdkmanager --list", ' +
        'then pass the suffix after "platforms;android-" to "sdk-version". ' +
        `If no codename package is listed, use an available numeric suffix.${originalError}`,
      { cause: error },
    );
  }
  if (versions.buildToolsVersion.length > 0) {
    core.info(
      `success install build-tools:${versions.buildToolsVersion.join(",")} and platform-tools and sdk:${versions.sdkVersion.join(",")}`,
    );
  } else {
    core.info(
      `success install platform-tools and sdk:${versions.sdkVersion.join(",")} (build-tools skipped)`,
    );
  }

  if (versions.cmakeVersion) {
    core.info(`start install cmake:${versions.cmakeVersion}`);
    await exec.exec(sdkManager, [`cmake;${versions.cmakeVersion}`, "--verbose"], execOptions);
    core.info(`success install cmake:${versions.cmakeVersion}`);
  }
  if (versions.ndkVersion) {
    core.info(`start install ndk:${versions.ndkVersion}`);
    await exec.exec(sdkManager, [`ndk;${versions.ndkVersion}`, "--verbose"], execOptions);
    core.info(`success install ndk:${versions.ndkVersion}`);
  }
}
