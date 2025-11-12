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
exports.addPath = addPath;
const path = __importStar(require("node:path"));
const core = __importStar(require("@actions/core"));
const constants_1 = require("./constants");
function addPath({ ndkVersion }) {
    core.exportVariable('ANDROID_SDK_ROOT', constants_1.ANDROID_SDK_ROOT);
    core.exportVariable('ANDROID_HOME', constants_1.ANDROID_SDK_ROOT);
    const ndkPath = ndkVersion
        ? path.join(constants_1.ANDROID_SDK_ROOT, 'ndk', ndkVersion)
        : undefined;
    if (ndkPath) {
        core.exportVariable('ANDROID_NDK_ROOT', ndkPath);
        core.exportVariable('ANDROID_NDK_HOME', ndkPath);
        core.exportVariable('ANDROID_NDK', ndkPath);
    }
    core.info('Variables');
    core.info(`  ANDROID_SDK_ROOT: ${constants_1.ANDROID_SDK_ROOT}`);
    core.info(`  ANDROID_HOME: ${constants_1.ANDROID_SDK_ROOT}`);
    if (ndkPath) {
        core.info(`  ANDROID_NDK_ROOT: ${ndkPath}`);
        core.info(`  ANDROID_NDK_HOME: ${ndkPath}`);
        core.info(`  ANDROID_NDK: ${ndkPath}`);
    }
    core.addPath(path.join(constants_1.ANDROID_SDK_ROOT, 'platform-tools'));
    core.addPath(path.join(constants_1.ANDROID_SDK_ROOT, 'ndk-bundle'));
    core.addPath(path.join(constants_1.ANDROID_SDK_ROOT, 'cmdline-tools', 'latest', 'bin'));
    core.info('Path');
    core.info(`  ${path.join(constants_1.ANDROID_SDK_ROOT, 'platform-tools')}`);
    core.info(`  ${path.join(constants_1.ANDROID_SDK_ROOT, 'ndk-bundle')}`);
    core.info(`  ${path.join(constants_1.ANDROID_SDK_ROOT, 'cmdline-tools', 'latest', 'bin')}`);
}
