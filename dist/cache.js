"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreCache = restoreCache;
exports.saveCache = saveCache;
exports.getRestoredEntry = getRestoredEntry;
const cache = __importStar(require("@actions/cache"));
const cache_1 = require("@actions/cache");
const core = __importStar(require("@actions/core"));
const constants_1 = require("./constants");
const RESTORED_ENTRY_STATE_KEY = 'restoredEntry';
function simpleHash(str) {
    let hash = 0;
    if (str.length === 0)
        return hash.toString(16);
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 8);
}
function generateRestoreKey(versions, cacheKey) {
    const suffixVersion = 'v5';
    // https://github.com/actions/cache/issues/1127
    const dirHash = simpleHash(constants_1.ANDROID_HOME_DIR);
    const baseKey = cacheKey
        ? `${cacheKey}-${dirHash}-${suffixVersion}`
        : `${versions.sdkVersion}-${versions.buildToolsVersion}-${versions.ndkVersion}-${versions.cmakeVersion}-${versions.commandLineToolsVersion}-${dirHash}-${suffixVersion}`;
    // cache keys can't contain `,`
    return baseKey.replace(/,/g, '').toLowerCase();
}
async function restoreCache(versions, cacheKey) {
    const restoreKey = generateRestoreKey(versions, cacheKey);
    const restoredEntry = await cache.restoreCache([constants_1.ANDROID_HOME_DIR], restoreKey);
    if (restoredEntry) {
        core.info(`Found in cache: ${restoreKey}`);
    }
    else {
        core.info(`Not Found cache: ${restoreKey}`);
    }
    core.saveState(RESTORED_ENTRY_STATE_KEY, restoredEntry);
    return Promise.resolve(restoredEntry);
}
async function saveCache(versions, cacheKey) {
    const restoreKey = generateRestoreKey(versions, cacheKey);
    core.info(`checking if "${restoreKey}" is already cached ...`);
    core.info(`cacheDir: ${constants_1.ANDROID_HOME_DIR}`);
    const hasEntry = await cache.restoreCache([constants_1.ANDROID_HOME_DIR], restoreKey, [], { lookupOnly: true });
    if (hasEntry) {
        core.info(`Found in cache: ${restoreKey}`);
        return;
    }
    core.info(`caching "${restoreKey}" ...`);
    try {
        const savedEntry = await cache.saveCache([constants_1.ANDROID_HOME_DIR], restoreKey);
        return Promise.resolve(savedEntry);
    }
    catch (error) {
        if (error instanceof cache_1.ReserveCacheError) {
            core.info(error.message);
        }
    }
}
function getRestoredEntry() {
    const restoredEntryJson = core.getState(RESTORED_ENTRY_STATE_KEY);
    if (restoredEntryJson) {
        return JSON.parse(restoredEntryJson);
    }
}
