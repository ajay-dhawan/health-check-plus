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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVersionInfo = exports.AppVersionInfo = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const simple_git_1 = __importDefault(require("simple-git"));
// Resolve the path to the Git repository
const repoPath = path_1.default.resolve(__dirname, '../.git');
/**
 * Holds version information for the application.
 */
class AppVersionInfo {
    /**
     * Creates an instance of AppVersionInfo.
     * @param {string} [version] - Application version.
     * @param {string} [commitHash] - Commit hash.
     */
    constructor(version, commitHash) {
        this.version = version || null;
        this.commitHash = commitHash || null;
    }
}
exports.AppVersionInfo = AppVersionInfo;
/**
 * Retrieves version information for the application.
 * @param {string} [packageJsonPath] - Path to the package.json file (optional).
 * @param {AppVersionInfo} [versionInfo] - Existing version information (optional).
 * @returns {Promise<AppVersionInfo>} - Version information for the application.
 */
function GetVersionInfo(packageJsonPath, versionInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if versionInfo is provided and valid
        if (versionInfo != null &&
            typeof versionInfo.commitHash === 'string' && versionInfo.commitHash.trim() !== '' &&
            typeof versionInfo.version === 'string' && versionInfo.version.trim() !== '') {
            return versionInfo;
        }
        // Set default path for package.json if not provided
        if (!packageJsonPath) {
            packageJsonPath = "./package.json";
        }
        // Read package.json file and parse version
        const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(packageJsonContent);
        const version = packageJson.version;
        // Get latest commit hash from Git
        let commitHash;
        try {
            commitHash = yield getLatestCommitInfo();
        }
        catch (err) {
            console.error("Error:", err);
            commitHash = "Unable to get latest commit hash";
        }
        // Create AppVersionInfo instance
        versionInfo = new AppVersionInfo(version, commitHash);
        return versionInfo;
    });
}
exports.GetVersionInfo = GetVersionInfo;
/**
 * SimpleGit instance for interacting with the Git repository.
 */
const git = (0, simple_git_1.default)(repoPath);
/**
 * Retrieves the latest commit information.
 * @returns {Promise<string>} - A Promise resolving to the latest commit hash.
 */
function getLatestCommitInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            git.log({ n: 1 }, (err, logSummary) => {
                if (err) {
                    console.error('Error:', err);
                    reject(err);
                }
                else if (logSummary.latest) {
                    console.info('Latest Commit:', logSummary.latest);
                    resolve(logSummary.latest.hash);
                }
            });
        });
    });
}
//# sourceMappingURL=index.js.map