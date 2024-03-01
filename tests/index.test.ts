import * as fs from 'fs';
import simpleGit from 'simple-git';
import { AppVersionInfo, GetVersionInfo } from '../index';

describe("GetVersionInfo", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return version info with correct version and commit hash", async () => {
    const mockReadFileSync = jest.spyOn(fs, "readFileSync");
    mockReadFileSync.mockReturnValueOnce(JSON.stringify({ version: "1.0.0" }));

    const mockLog = jest.spyOn(simpleGit().constructor.prototype, "log");
    mockLog.mockResolvedValueOnce({ latest: { hash: "mocked-commit-hash" } });

    const versionInfo = await GetVersionInfo("./package.json");
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBe("1.0.0");
    expect(versionInfo.commitHash).toBe("mocked-commit-hash");
  });

  it("should return version info with default package.json path", async () => {
    const mockReadFileSync = jest.spyOn(fs, "readFileSync");
    mockReadFileSync.mockReturnValueOnce('{"version": "1.0.0"}');

    const mockLog = jest.spyOn(simpleGit().constructor.prototype, "log");
    mockLog.mockResolvedValueOnce({ latest: { hash: "mocked-commit-hash" } });

    const versionInfo = await GetVersionInfo();
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBe("1.0.0");
    expect(versionInfo.commitHash).toBe("mocked-commit-hash");
  });

  it("should return version info with provided version and commit hash", async () => {
    const versionInfo = await GetVersionInfo(
      "./package.json",
      new AppVersionInfo("1.1.0", "custom-hash")
    );
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBe("1.1.0");
    expect(versionInfo.commitHash).toBe("custom-hash");
  });

  it("should handle error when reading package.json", async () => {
    const mockReadFileSync = jest.spyOn(fs, "readFileSync");
    mockReadFileSync.mockImplementationOnce(() => {
      throw new Error("Error reading package.json");
    });

    const versionInfo = await GetVersionInfo("./package.json");
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBeNull();
    expect(versionInfo.commitHash).toBeNull();
  });

  it("should handle error when getting latest commit info", async () => {
    const mockReadFileSync = jest.spyOn(fs, "readFileSync");
    mockReadFileSync.mockReturnValueOnce('{"version": "1.0.0"}');

    const mockLog = jest.spyOn(simpleGit().constructor.prototype, "log");
    mockLog.mockRejectedValueOnce(
      new Error("Error getting latest commit info")
    );

    const versionInfo = await GetVersionInfo();
    expect(versionInfo).toBeInstanceOf(AppVersionInfo);
    expect(versionInfo.version).toBe("1.0.0");
    expect(versionInfo.commitHash).toBeNull();
  });
});
