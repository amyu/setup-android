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
exports.isJobStatusSuccess = isJobStatusSuccess;
const core = __importStar(require("@actions/core"));
const cache_1 = require("./cache");
const constants = __importStar(require("./constants"));
const constants_1 = require("./constants");
const summary_1 = require("./summary");
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
            savedCacheEntry = await (0, cache_1.saveCache)(versions, cacheKey);
            core.endGroup();
        }
        if (generateJobSummary) {
            await (0, summary_1.renderSummary)(versions, savedCacheEntry);
        }
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
function isJobStatusSuccess() {
    const jobStatus = core.getInput(constants_1.INPUT_JOB_STATUS);
    return jobStatus === 'success';
}
run();
