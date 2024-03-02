import * as fs from 'fs';
import * as path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

// Resolve the path to the Git repository
const repoPath = path.resolve(__dirname, '../');

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
    packageJsonPath = "./package.json";
  }

  // Read package.json file and parse version
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonContent);
  const version = packageJson.version;

  // Get latest commit hash from Git
  let commitHash;
  try {
    commitHash = await getLatestCommitInfo();
  } catch (err) {
    console.error("Error:", err);
    commitHash = "Unable to get latest commit hash";
  }

  // Create AppVersionInfo instance
  versionInfo = new AppVersionInfo(version, commitHash);

  // Write versionInfo to an env file with name health-check-plus-data.json, if file not present then create that file and write data into it
  fs.writeFileSync(path.resolve(__dirname, '../health-check-plus-data.json'), JSON.stringify(versionInfo));
  console.log('Version Info:  ',  versionInfo);
  
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
      } else if (logSummary.latest){
        console.info('Latest Commit:', logSummary.latest);
        resolve(logSummary.latest.hash);
      }
    });
  });
}

/**
 * Exports VersionInfo class and GetVersionInfo function for external use.
 */
export { AppVersionInfo , GetVersionInfo };
