import * as core from '@actions/core';
import { getRestoredEntry } from './cache.js';
const SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
export async function renderSummary(versions, savedCacheEntry) {
    // is supported job summary
    if (!process.env[SUMMARY_ENV_VAR]) {
        return Promise.resolve();
    }
    core.summary.addHeading('setup-android');
    core.summary.addTable([
        [
            { data: 'SDK', header: true },
            { data: 'Build Tools', header: true },
            { data: 'NDK', header: true },
            { data: 'Cmake', header: true },
            { data: 'Command Line Tools', header: true }
        ],
        [
            formatList(versions.sdkVersion),
            formatList(versions.buildToolsVersion),
            formatValue(versions.ndkVersion),
            formatValue(versions.cmakeVersion),
            versions.commandLineToolsVersion
        ]
    ]);
    const restoredCacheEntry = getRestoredEntry();
    core.summary.addHeading('Cached Summary', 3);
    if (savedCacheEntry) {
        core.summary.addRaw(`save cache key: <code>${savedCacheEntry.key}</code>`, true);
    }
    else {
        core.summary.addRaw('Not saved cache', true);
    }
    core.summary.addBreak();
    if (restoredCacheEntry) {
        core.summary.addRaw(`restore cache key: <code>${restoredCacheEntry.key}</code>`, true);
    }
    else {
        core.summary.addRaw('Not restored cache', true);
    }
    core.summary.addTable([
        [
            { data: 'Cached size', header: true },
            { data: 'Restored size', header: true }
        ],
        [formatSize(savedCacheEntry?.size), formatSize(restoredCacheEntry?.size)]
    ]);
    await core.summary.write();
}
function formatSize(bytes) {
    if (bytes === undefined || bytes === 0) {
        return 'X';
    }
    return `${Math.round(bytes / (1024 * 1024))} MB (${bytes} B)`;
}
function formatList(values) {
    return values.length > 0 ? values.join(', ') : 'Not specified';
}
function formatValue(value) {
    return value || 'Not specified';
}
