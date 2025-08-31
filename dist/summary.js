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
exports.renderSummary = renderSummary;
const core = __importStar(require("@actions/core"));
const summary_1 = require("@actions/core/lib/summary");
const cache_1 = require("./cache");
async function renderSummary(versions, savedCacheEntry) {
    // is supported job summary
    if (!process.env[summary_1.SUMMARY_ENV_VAR]) {
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
            versions.sdkVersion.join(', '),
            versions.buildToolsVersion,
            versions.ndkVersion,
            versions.cmakeVersion,
            versions.commandLineToolsVersion
        ]
    ]);
    const restoredCacheEntry = (0, cache_1.getRestoredEntry)();
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
