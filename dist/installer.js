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
exports.installAndroidSdk = installAndroidSdk;
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("node:path"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const toolCache = __importStar(require("@actions/tool-cache"));
const constants_1 = require("./constants");
async function installAndroidSdk(versions) {
    await fs.rm(constants_1.ANDROID_SDK_ROOT, { recursive: true, force: true });
    await fs.rm(path.join(constants_1.ANDROID_SDK_ROOT, 'cmdline-tools', 'latest'), {
        recursive: true,
        force: true
    });
    core.info('success cleanup');
    await fs.mkdir(constants_1.ANDROID_SDK_ROOT, { recursive: true });
    core.info('success create directory');
    let cmdlineToolsDownloadUrl;
    switch (process.platform) {
        case 'win32':
            cmdlineToolsDownloadUrl = (0, constants_1.COMMANDLINE_TOOLS_WINDOWS_URL)(versions.commandLineToolsVersion);
            break;
        case 'darwin':
            cmdlineToolsDownloadUrl = (0, constants_1.COMMANDLINE_TOOLS_MAC_URL)(versions.commandLineToolsVersion);
            break;
        case 'linux':
            cmdlineToolsDownloadUrl = (0, constants_1.COMMANDLINE_TOOLS_LINUX_URL)(versions.commandLineToolsVersion);
            break;
        default:
            throw Error(`Unsupported platform: ${process.platform}`);
    }
    core.info(`start download cmdline-tools url: ${cmdlineToolsDownloadUrl}`);
    const downloadedCmdlineToolsPath = await toolCache.downloadTool(cmdlineToolsDownloadUrl);
    core.info(`success download cmdline-tools path: ${downloadedCmdlineToolsPath}`);
    core.info('start extract cmdline-tools.zip');
    const extractedCmdlineToolPath = await toolCache.extractZip(downloadedCmdlineToolsPath, path.join(constants_1.ANDROID_SDK_ROOT, 'cmdline-tools'));
    core.info(`success extract cmdline-tools.zip path: ${extractedCmdlineToolPath}`);
    const from = path.join(extractedCmdlineToolPath, 'cmdline-tools');
    const to = 'latest';
    core.info(`start rename ${from} to ${to}`);
    if (process.platform === 'win32') {
        await exec.exec(`cmd /c "rename ${from} ${to}"`);
    }
    else {
        await fs.mkdir(path.join(constants_1.ANDROID_SDK_ROOT, 'cmdline-tools', to), {
            recursive: true
        });
        await fs.rename(from, path.join(constants_1.ANDROID_SDK_ROOT, 'cmdline-tools', to));
    }
    core.info(`success rename ${from} to ${to}`);
    core.info('start accept licenses');
    // https://github.com/actions/toolkit/issues/359 pipes workaround
    switch (process.platform) {
        case 'win32':
            await exec.exec(`cmd /c "yes | sdkmanager --licenses"`, [], {
                silent: !core.isDebug()
            });
            break;
        case 'darwin':
            await exec.exec(`/bin/bash -c "yes | sdkmanager --licenses"`, [], {
                silent: !core.isDebug()
            });
            break;
        case 'linux':
            await exec.exec(`/bin/bash -c "yes | sdkmanager --licenses"`, [], {
                silent: !core.isDebug()
            });
            break;
        default:
            throw Error(`Unsupported platform: ${process.platform}`);
    }
    core.info('success accept licenses');
    core.info(`start install build-tools:${versions.buildToolsVersion} and platform-tools and sdk:${versions.sdkVersion}`);
    const sdkVersionCommand = versions.sdkVersion.map(version => `platforms;android-${version}`);
    await exec.exec('sdkmanager', [
        `build-tools;${versions.buildToolsVersion}`,
        'platform-tools',
        ...sdkVersionCommand,
        '--verbose'
    ], { silent: !core.isDebug() });
    core.info(`success install build-tools:${versions.buildToolsVersion} and platform-tools and sdk:${versions.sdkVersion}`);
    if (versions.cmakeVersion) {
        core.info(`start install cmake:${versions.cmakeVersion}`);
        await exec.exec('sdkmanager', [`cmake;${versions.cmakeVersion}`, '--verbose'], {
            silent: !core.isDebug()
        });
        core.info(`success install cmake:${versions.cmakeVersion}`);
    }
    if (versions.ndkVersion) {
        core.info(`start install ndk:${versions.ndkVersion}`);
        await exec.exec('sdkmanager', [`ndk;${versions.ndkVersion}`, '--verbose'], {
            silent: !core.isDebug()
        });
        core.info(`success install ndk:${versions.ndkVersion}`);
    }
}
