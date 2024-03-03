import * as fs from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';

// Resolve the path to the Git repository
let repoPath: string | undefined = undefined;

/**
 * Holds version information for the application.
 */
class AppVersionInfo {
  /**
   * Application version.
   */
  public version: string | null;

  /**
   * Commit hash.
   */
  public commitHash: string | null;

  /**
   * Creates an instance of AppVersionInfo.
   * @param {string} [version] - Application version.
   * @param {string} [commitHash] - Commit hash.
   */
  constructor(version?: string, commitHash?: string) {
    this.version = version || null;
    this.commitHash = commitHash || null;
  }
}

/**
 * Retrieves version information for the application.
 * @param {string} [packageJsonPath] - Path to the package.json file (optional).
 * @param {AppVersionInfo} [versionInfo] - Existing version information (optional).
 * @returns {Promise<AppVersionInfo>} - Version information for the application.
 */
async function GetVersionInfo(packageJsonPath?: string, versionInfo?: AppVersionInfo): Promise<AppVersionInfo> {

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
  let commitHash: string | null = null;
  try {
    commitHash = await getLatestCommitInfo();
  } catch (err) {
    console.error('Error: ', err);
    commitHash = 'Unable to get latest commit hash';
  }

  // Check if commitHash is present in package.json or not, if present compare it with the latest commit hash, if not, add it
  if (typeof packageJson['commit-hash'] === 'string' && packageJson['commit-hash'].trim() !== '') {
    if (packageJson['commit-hash'] !== commitHash) {
      if (commitHash !== 'Unable to get latest commit hash') {
        console.info('Updating commit-hash in package.json to latest commit hash');
        packageJson['commit-hash'] = commitHash;
      } else {
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
}

/**
 * SimpleGit instance for interacting with the Git repository.
 */
const git: SimpleGit = simpleGit(repoPath);

/**
 * Retrieves the latest commit information.
 * @returns {Promise<string>} - A Promise resolving to the latest commit hash.
 */
async function getLatestCommitInfo(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    git.log({ n: 1 }, (err, logSummary) => {
      if (err) {
        console.error('Error:', err);
        reject(err);
      } else if (logSummary.latest) {
        resolve(logSummary.latest.hash);
      }
    });
  });
}

/**
 * Exports VersionInfo class and getVersionInfo function for external use.
 */
export { AppVersionInfo, GetVersionInfo };