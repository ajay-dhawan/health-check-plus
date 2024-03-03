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
exports.healthCheckPlus = exports.getVersionInfo = exports.AppVersionInfo = void 0;
const fs = __importStar(require("fs"));
const simple_git_1 = __importDefault(require("simple-git"));
// Resolve the path to the Git repository
let repoPath = undefined;
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
function getVersionInfo(packageJsonPath, versionInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if versionInfo is provided and valid
        if (versionInfo != null &&
            typeof versionInfo.commitHash === 'string' && versionInfo.commitHash.trim() !== '' &&
            typeof versionInfo.version === 'string' && versionInfo.version.trim() !== '') {
            return versionInfo;
        }
        // Set default path for package.json if not provided
        if (!packageJsonPath) {
            packageJsonPath = './package.json';
        }
        // Read package.json file and parse version
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonContent);
        // Version will always be present in package.json
        const version = packageJson.version;
        // If repoPath is not set, set it to the current working directory (cwd)
        if (repoPath === undefined || repoPath.trim() === '') {
            repoPath = process.cwd();
        }
        // Get latest commit hash from Git
        let commitHash = null;
        try {
            commitHash = yield getLatestCommitInfo();
        }
        catch (err) {
            console.error('Error: ', err);
            commitHash = 'Unable to get latest commit hash';
        }
        // Check if commitHash is present in package.json or not, if present compare it with the latest commit hash, if not, add it
        if (typeof packageJson['commit-hash'] === 'string' && packageJson['commit-hash'].trim() !== '') {
            if (packageJson['commit-hash'] !== commitHash) {
                if (commitHash !== 'Unable to get latest commit hash') {
                    console.info('Updating commit-hash in package.json to latest commit hash');
                    packageJson['commit-hash'] = commitHash;
                }
                else {
                    packageJson['commit-hash'] = 'Alert! This may not be the latest commit hash -->' + packageJson['commit-hash'];
                }
            }
        }
        // Add commitHash to config and write it back to package.json
        packageJson['commit-hash'] = commitHash;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        // Create AppVersionInfo instance
        versionInfo = new AppVersionInfo(version, commitHash);
        return versionInfo;
    });
}
exports.getVersionInfo = getVersionInfo;
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
                    resolve(logSummary.latest.hash);
                }
            });
        });
    });
}
/**
 * Middleware function for performing a health check plus operation.
 * Retrieves version and latest commit information and sends it as a JSON response.
 * These health checks are available out of the box:
 * - '/HealthCheck'
 * - '/HealthCheck/'
 * - '/Health-Check'
 * - '/Health-Check/'
 * - '/health-check'
 * - '/health-check/'
 * - '/healthCheck'
 * - '/healthCheck/'
 * - '/health-check-plus'
 * - '/health-check-plus/'
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express NextFunction object.
 */
function healthCheckPlus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const endpoint = req.url;
            switch (endpoint) {
                // Valid endpoints for health check plus operation
                case '/healthcheck':
                case '/healthcheck/':
                case '/HealthCheck':
                case '/HealthCheck/':
                case '/Health-Check':
                case '/Health-Check/':
                case '/health-check':
                case '/health-check/':
                case '/healthCheck':
                case '/healthCheck/':
                case '/healthCheckPlus':
                case '/healthCheckPlus/':
                case '/health-check-plus':
                case '/health-check-plus/':
                    const versionInfo = yield getVersionInfo();
                    res.status(200).send(JSON.stringify(versionInfo, null, 2));
                    break;
            }
        }
        catch (error) {
            console.error(error);
            res.status(501).send(JSON.stringify({ error: error }, null, 2));
        }
        next();
    });
}
exports.healthCheckPlus = healthCheckPlus;
//# sourceMappingURL=index.js.map