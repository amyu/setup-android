import * as core from "@actions/core";

import { addPath } from "./add-path.js";
import { restoreCache } from "./cache.js";
import * as constants from "./constants.js";
import { installAndroidSdk } from "./installer.js";
import { readVersions } from "./versions.js";

async function run(): Promise<void> {
  try {
    const versions = readVersions((message) => core.warning(message));
    const cacheDisabled = core.getBooleanInput(constants.INPUT_CACHE_DISABLED);
    const cacheKey = core.getInput(constants.INPUT_CACHE_KEY);

    core.exportVariable("ANDROID_SDK_ROOT", constants.ANDROID_SDK_ROOT);
    core.exportVariable("ANDROID_HOME", constants.ANDROID_SDK_ROOT);

    let restored = false;
    if (!cacheDisabled) {
      core.startGroup("Restored Android SDK from Cache");
      restored = Boolean(await restoreCache(versions, cacheKey));
      core.endGroup();
    }
    if (!restored) {
      core.startGroup("Installed Android SDK");
      await installAndroidSdk(versions);
      core.endGroup();
    }

    core.startGroup("Environment details for Android SDK");
    await addPath(versions);
    core.endGroup();
  } catch (error) {
    core.info("To see the logs executed by sdkmanager, set ACTIONS_STEP_DEBUG to true");
    core.info(
      "https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging",
    );
    if (error instanceof Error) core.setFailed(error.message);
  }
}

void run();
