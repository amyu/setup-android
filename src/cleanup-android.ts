import type { CacheEntry } from "@actions/cache";
import * as core from "@actions/core";

import { getCompletedSetup } from "./cache-state.js";
import { saveCache } from "./cache.js";
import * as constants from "./constants.js";
import { INPUT_JOB_STATUS } from "./constants.js";
import { renderSummary } from "./summary.js";

async function run(): Promise<void> {
  try {
    if (!isJobStatusSuccess()) {
      return Promise.resolve();
    }

    const setup = getCompletedSetup();
    if (!setup) return;
    const generateJobSummary = core.getBooleanInput(constants.INPUT_GENERATE_JOB_SUMMARY);

    let savedCacheEntry: CacheEntry | undefined;
    if (setup.cacheKey) {
      core.startGroup("Save Cache");
      savedCacheEntry = await saveCache(setup.cacheKey);
      core.endGroup();
    }

    if (generateJobSummary) {
      await renderSummary(setup.versions, savedCacheEntry);
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

export function isJobStatusSuccess(): boolean {
  const jobStatus = core.getInput(INPUT_JOB_STATUS);

  return jobStatus === "success";
}

void run();
