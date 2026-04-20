import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadCommitPolicyConfig } from "../src/config-loader";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "yl-tooling-config-loader-"));
}

function writeJsonFile(dir: string, fileName: string, value: unknown): void {
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
}

function writeRawFile(dir: string, fileName: string, value: string): void {
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, value, "utf-8");
}

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("loadCommitPolicyConfig", () => {
  it("loads valid config", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      pattern: "^(feat|fix|docs)\\(([a-z0-9-]+)\\): ([A-Z]+-[0-9]+) (.+)$",
      flags: "",
    });

    writeJsonFile(dir, "commit-types.json", {
      types: ["feat", "fix", "docs"],
    });

    const result = loadCommitPolicyConfig(dir);

    expect(result).toEqual({
      pattern: "^(feat|fix|docs)\\(([a-z0-9-]+)\\): ([A-Z]+-[0-9]+) (.+)$",
      flags: "",
      allowedTypes: ["feat", "fix", "docs"],
    });
  });

  it("fails when commit-regex.json is missing", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-types.json", {
      types: ["feat", "fix", "docs"],
    });

    expect(() => loadCommitPolicyConfig(dir)).toThrow(
      /Missing config file: .*commit-regex\.json/
    );
  });

  it("fails when commit-types.json is missing", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      pattern: "^(feat|fix|docs)\\(([a-z0-9-]+)\\): ([A-Z]+-[0-9]+) (.+)$",
      flags: "",
    });

    expect(() => loadCommitPolicyConfig(dir)).toThrow(
      /Missing config file: .*commit-types\.json/
    );
  });

  it("fails when commit-regex.json contains invalid JSON", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeRawFile(dir, "commit-regex.json", "{ invalid json");
    writeJsonFile(dir, "commit-types.json", {
      types: ["feat", "fix", "docs"],
    });

    expect(() => loadCommitPolicyConfig(dir)).toThrow(
      /Invalid JSON in config file: .*commit-regex\.json/
    );
  });

  it("fails when commit-types.json contains invalid JSON", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      pattern: "^(feat|fix|docs)\\(([a-z0-9-]+)\\): ([A-Z]+-[0-9]+) (.+)$",
      flags: "",
    });

    writeRawFile(dir, "commit-types.json", "{ invalid json");

    expect(() => loadCommitPolicyConfig(dir)).toThrow(
      /Invalid JSON in config file: .*commit-types\.json/
    );
  });

  it("fails when commit-regex.json has invalid structure", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      wrong: "value",
    });

    writeJsonFile(dir, "commit-types.json", {
      types: ["feat", "fix", "docs"],
    });

    expect(() => loadCommitPolicyConfig(dir)).toThrow(
      /Invalid config structure in .*commit-regex\.json/
    );
  });

  it("fails when commit-types.json has invalid structure", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      pattern: "^(feat|fix|docs)\\(([a-z0-9-]+)\\): ([A-Z]+-[0-9]+) (.+)$",
      flags: "",
    });

    writeJsonFile(dir, "commit-types.json", {
      wrong: ["feat", "fix"],
    });

    expect(() => loadCommitPolicyConfig(dir)).toThrow(
      /Invalid config structure in .*commit-types\.json/
    );
  });

  it("fails when commit-types.json contains empty type values", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      pattern: "^(feat|fix|docs)\\(([a-z0-9-]+)\\): ([A-Z]+-[0-9]+) (.+)$",
      flags: "",
    });

    writeJsonFile(dir, "commit-types.json", {
      types: ["feat", "", "docs"],
    });

    expect(() => loadCommitPolicyConfig(dir)).toThrow(
      /Invalid config structure in .*commit-types\.json/
    );
  });

  it("fails when regex pattern is invalid", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      pattern: "^(feat|fix(",
      flags: "",
    });

    writeJsonFile(dir, "commit-types.json", {
      types: ["feat", "fix"],
    });

    expect(() => loadCommitPolicyConfig(dir)).toThrow(
      /Invalid regex pattern in .*commit-regex\.json/
    );
  });

  it("deduplicates and trims allowed commit types", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      pattern: "^(feat|fix|docs)\\(([a-z0-9-]+)\\): ([A-Z]+-[0-9]+) (.+)$",
      flags: "",
    });

    writeJsonFile(dir, "commit-types.json", {
      types: ["feat", " fix ", "docs", "feat"],
    });

    const result = loadCommitPolicyConfig(dir);

    expect(result.allowedTypes).toEqual(["feat", "fix", "docs"]);
  });

  it("defaults flags to empty string when omitted", () => {
    const dir = createTempDir();
    tempDirs.push(dir);

    writeJsonFile(dir, "commit-regex.json", {
      pattern: "^(feat|fix|docs)\\(([a-z0-9-]+)\\): ([A-Z]+-[0-9]+) (.+)$",
    });

    writeJsonFile(dir, "commit-types.json", {
      types: ["feat", "fix", "docs"],
    });

    const result = loadCommitPolicyConfig(dir);

    expect(result.flags).toBe("");
  });
});