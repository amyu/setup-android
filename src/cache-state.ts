import { createHash, randomUUID } from "node:crypto";

import * as core from "@actions/core";

import type { Versions } from "./constants.js";

const SDK_OWNER_ENV = "SETUP_ANDROID_SDK_OWNER";
const COMPLETED_SETUP_STATE = "completedSetup";

export function generateCacheKey(versions: Versions, customKey: string, sdkRoot: string): string {
  const selection = customKey
    ? { customKey: customKey.toLowerCase() }
    : {
        sdk: versions.sdkVersion,
        buildTools: versions.buildToolsVersion,
        ndk: versions.ndkVersion,
        cmake: versions.cmakeVersion,
        commandLineTools: versions.commandLineToolsVersion,
      };
  const inputs = [
    process.platform,
    process.arch,
    sdkRoot,
    versions.commandLineToolsArchive.sha256,
    selection,
  ];
  return `setup-android-v8-${createHash("sha256").update(JSON.stringify(inputs)).digest("hex")}`;
}

type CompletedSetup = {
  owner: string;
  versions: Versions;
  cacheKey?: string;
};

export function beginSdkSetup(): string {
  // Every invocation can modify the shared SDK, including cache hits and cache-disabled installs.
  const owner = randomUUID();
  core.exportVariable(SDK_OWNER_ENV, owner);
  return owner;
}

export function recordCompletedSetup(setup: CompletedSetup): void {
  core.saveState(COMPLETED_SETUP_STATE, setup);
}

export function getCompletedSetup(): CompletedSetup | undefined {
  const state = core.getState(COMPLETED_SETUP_STATE);
  if (!state) return undefined;
  const setup: CompletedSetup = JSON.parse(state);
  if (setup.owner !== process.env[SDK_OWNER_ENV]) delete setup.cacheKey;
  return setup;
}
