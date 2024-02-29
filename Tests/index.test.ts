import * as fs from 'fs';
import simpleGit from 'simple-git';
import { AppVersionInfo, GetVersionInfo } from '../index';

describe('GetVersionInfo', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocked functions after each test
  });

  it('should return version info with correct version and commit hash', async () => {
    // Mock fs.readFileSync to return package.json content
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"version": "1.0.0"}');

    // Mock simple-git log function to return the latest commit hash
    jest.spyOn(simpleGit().constructor.prototype, 'log').mockImplementation(async () => {
      return { latest: { hash: 'mocked-commit-hash' } };
    });

    const versionInfo = await GetVersionInfo('./package.json');
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBe('1.0.0');
    expect(versionInfo.commitHash).toBe('mocked-commit-hash');
  });

  it('should return version info with default package.json path', async () => {
    // Mock fs.readFileSync to return package.json content
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"version": "1.0.0"}');

    // Mock simple-git log function to return the latest commit hash
    jest.spyOn(simpleGit().constructor.prototype, 'log').mockImplementation(async () => {
      return { latest: { hash: 'mocked-commit-hash' } };
    });

    const versionInfo = await GetVersionInfo();
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBe('1.0.0');
    expect(versionInfo.commitHash).toBe('mocked-commit-hash');
  });

  it('should return version info with provided version and commit hash', async () => {
    const versionInfo = await GetVersionInfo('./package.json', new AppVersionInfo('1.1.0', 'custom-hash'));
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBe('1.1.0');
    expect(versionInfo.commitHash).toBe('custom-hash');
  });

  it('should handle error when reading package.json', async () => {
    // Mock fs.readFileSync to throw an error
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('Error reading package.json');
    });

    const versionInfo = await GetVersionInfo('./package.json');
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBeNull(); // Version should be null if there's an error
    expect(versionInfo.commitHash).toBeNull(); // Commit hash should be null if there's an error
  });

  it('should handle error when getting latest commit info', async () => {
    // Mock fs.readFileSync to return package.json content
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"version": "1.0.0"}');

    // Mock simple-git log function to throw an error
    jest.spyOn(simpleGit().constructor.prototype, 'log').mockImplementation(async () => {
      throw new Error('Error getting latest commit info');
    });

    const versionInfo = await GetVersionInfo();
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBe('1.0.0'); // Should use default version
    expect(versionInfo.commitHash).toBeNull(); // Commit hash should be null if there's an error
  });

  // Add more test cases as needed
});
