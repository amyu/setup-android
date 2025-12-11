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
const core = __importStar(require("@actions/core"));
const add_path_1 = require("./add-path");
const cache_1 = require("./cache");
const constants = __importStar(require("./constants"));
const installer_1 = require("./installer");
async function run() {
    try {
        const sdkVersion = core.getMultilineInput(constants.INPUT_SDK_VERSION);
        const buildToolsVersion = core.getMultilineInput(constants.INPUT_BUILD_TOOLS_VERSION);
        const ndkVersion = core.getInput(constants.INPUT_NDK_VERSION);
        const cmakeVersion = core.getInput(constants.INPUT_CMAKE_VERSION);
        const commandLineToolsVersion = core.getInput(constants.INPUT_COMMAND_LINE_TOOLS_VERSION);
        const cacheDisabled = core.getBooleanInput(constants.INPUT_CACHE_DISABLED);
        const cacheKey = core.getInput(constants.INPUT_CACHE_KEY);
        const versions = {
            sdkVersion,
            buildToolsVersion,
            ndkVersion,
            cmakeVersion,
            commandLineToolsVersion
        };
        core.startGroup('Environment details for Android SDK');
        (0, add_path_1.addPath)(versions);
        core.endGroup();
        if (!cacheDisabled) {
            core.startGroup('Restored Android SDK from Cache');
            const restoreCacheEntry = await (0, cache_1.restoreCache)(versions, cacheKey);
            core.endGroup();
            if (restoreCacheEntry) {
                return Promise.resolve();
            }
        }
        core.startGroup('Installed Android SDK');
        await (0, installer_1.installAndroidSdk)(versions);
        core.endGroup();
    }
    catch (error) {
        core.info('To see the logs executed by sdkmanager, set ACTIONS_STEP_DEBUG to true');
        core.info('https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging');
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
run();
