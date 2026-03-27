import * as core from '@actions/core';
import { saveCache } from './cache.js';
import * as constants from './constants.js';
import { INPUT_JOB_STATUS } from './constants.js';
import { renderSummary } from './summary.js';
async function run() {
    try {
        if (!isJobStatusSuccess()) {
            return Promise.resolve();
        }
        const sdkVersion = core.getMultilineInput(constants.INPUT_SDK_VERSION);
        const buildToolsVersion = core.getMultilineInput(constants.INPUT_BUILD_TOOLS_VERSION);
        const ndkVersion = core.getInput(constants.INPUT_NDK_VERSION);
        const cmakeVersion = core.getInput(constants.INPUT_CMAKE_VERSION);
        const commandLineToolsVersion = core.getInput(constants.INPUT_COMMAND_LINE_TOOLS_VERSION);
        const cacheDisabled = core.getBooleanInput(constants.INPUT_CACHE_DISABLED);
        const cacheKey = core.getInput(constants.INPUT_CACHE_KEY);
        const generateJobSummary = core.getBooleanInput(constants.INPUT_GENERATE_JOB_SUMMARY);
        const versions = {
            sdkVersion,
            buildToolsVersion,
            ndkVersion,
            cmakeVersion,
            commandLineToolsVersion
        };
        let savedCacheEntry;
        if (!cacheDisabled) {
            core.startGroup('Save Cache');
            savedCacheEntry = await saveCache(versions, cacheKey);
            core.endGroup();
        }
        if (generateJobSummary) {
            await renderSummary(versions, savedCacheEntry);
        }
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
export function isJobStatusSuccess() {
    const jobStatus = core.getInput(INPUT_JOB_STATUS);
    return jobStatus === 'success';
}
run();
