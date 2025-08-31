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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANDROID_SDK_ROOT = exports.ANDROID_HOME_DIR = exports.HOME = exports.COMMANDLINE_TOOLS_WINDOWS_URL = exports.COMMANDLINE_TOOLS_MAC_URL = exports.COMMANDLINE_TOOLS_LINUX_URL = exports.INPUT_JOB_STATUS = exports.INPUT_GENERATE_JOB_SUMMARY = exports.INPUT_CACHE_KEY = exports.INPUT_CACHE_DISABLED = exports.INPUT_COMMAND_LINE_TOOLS_VERSION = exports.INPUT_CMAKE_VERSION = exports.INPUT_NDK_VERSION = exports.INPUT_BUILD_TOOLS_VERSION = exports.INPUT_SDK_VERSION = void 0;
const os = __importStar(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
exports.INPUT_SDK_VERSION = 'sdk-version';
exports.INPUT_BUILD_TOOLS_VERSION = 'build-tools-version';
exports.INPUT_NDK_VERSION = 'ndk-version';
exports.INPUT_CMAKE_VERSION = 'cmake-version';
exports.INPUT_COMMAND_LINE_TOOLS_VERSION = 'command-line-tools-version';
exports.INPUT_CACHE_DISABLED = 'cache-disabled';
exports.INPUT_CACHE_KEY = 'cache-key';
exports.INPUT_GENERATE_JOB_SUMMARY = 'generate-job-summary';
exports.INPUT_JOB_STATUS = 'job-status';
// https://developer.android.com/studio#command-tools
const COMMANDLINE_TOOLS_LINUX_URL = (version) => `https://dl.google.com/android/repository/commandlinetools-linux-${version}_latest.zip`;
exports.COMMANDLINE_TOOLS_LINUX_URL = COMMANDLINE_TOOLS_LINUX_URL;
const COMMANDLINE_TOOLS_MAC_URL = (version) => `https://dl.google.com/android/repository/commandlinetools-mac-${version}_latest.zip`;
exports.COMMANDLINE_TOOLS_MAC_URL = COMMANDLINE_TOOLS_MAC_URL;
const COMMANDLINE_TOOLS_WINDOWS_URL = (version) => `https://dl.google.com/android/repository/commandlinetools-win-${version}_latest.zip`;
exports.COMMANDLINE_TOOLS_WINDOWS_URL = COMMANDLINE_TOOLS_WINDOWS_URL;
exports.HOME = os.homedir();
// github hosted runnerのubuntu-latestではすでにandroid directoryが存在しているため.をつけて回避
exports.ANDROID_HOME_DIR = node_path_1.default.join(exports.HOME, '.android');
// https://developer.android.com/studio/command-line/variables
exports.ANDROID_SDK_ROOT = node_path_1.default.join(exports.ANDROID_HOME_DIR, 'sdk');
