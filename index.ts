import * as fs from 'fs';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

/**
 * Holds version information for the application.
 * @param version - Application version.
 * @param commitHash - Commit hash.
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
   */
  constructor(version?: string, commitHash?: string) {
    this.version = version || null;
    this.commitHash = commitHash || null;
  }
}

/**
 * Retrieves version information for the application.
 * @param packageJsonPath - Path to the package.json file (optional).
 * @param versionInfo - Existing version information (optional).
 * @returns VersionInfo information for the application.
 */
function GetVersionInfo(packageJsonPath?: string, versionInfo?: AppVersionInfo): AppVersionInfo {

  /**
   * Checks if the provided versionInfo is valid and non-empty.
   * Returns the versionInfo if valid, otherwise gets version info.
   */
  if (versionInfo != null &&
      !(typeof versionInfo.commitHash !== 'string' || versionInfo.commitHash.trim() === '') &&
      !(typeof versionInfo.version    !== 'string' || versionInfo.version.trim()    === '')
    ) { 
      return versionInfo; 
    }

  /**
   * Sets a default path for the package.json file if one is not provided.
   */
  if (!packageJsonPath) {
    packageJsonPath = "./package.json";
  }

  /**
   * Reads the package.json file and parses it to JSON.
   * Gets the version property from the parsed JSON.
   */
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonContent);
  const version = packageJson.version;

    /**
   * Gets the latest commit hash from Git, then creates an AppVersionInfo instance
   * using the package version and commit hash. If unable to get the commit hash,
   * creates the AppVersionInfo with a default message instead.
   */
  getLatestCommitInfo()
    .then((commitHash: string) => {
      versionInfo = new AppVersionInfo(version, commitHash);
    })
    .catch((err: Error) => {
      console.error("Error:", err);
      versionInfo = new AppVersionInfo(
        version,
        "Unable to get latest commit hash"
      );
    });

  return versionInfo;
}

const repoPath = path.resolve(__dirname, '.git');

/**
 * SimpleGit instance for interacting with the Git repository.
 */
const git: SimpleGit = simpleGit(repoPath);

/**
 * Retrieves the latest commit information.
 * @returns A Promise resolving to the latest commit hash.
 */
async function getLatestCommitInfo(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    git.log({ n: 1 }, (err, logSummary) => {
      if (err) {
        console.error('Error:', err);
        reject(err);
      } else {
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
