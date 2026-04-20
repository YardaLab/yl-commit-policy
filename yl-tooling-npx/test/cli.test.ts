import { describe, expect, it, vi } from "vitest";
import {
  parseCommitMessageArg,
  runCli,
  type CliDependencies,
} from "../src/cli-core";
import type {
  CommitPolicyConfig,
  CommitValidationResult,
} from "../src/types";

const testConfig: CommitPolicyConfig = {
  pattern: "^(\\w+)\\(([\\w\\-]+)\\):\\s([A-Z]+-\\d+)\\s(.+)$",
  allowedTypes: [
    "feat",
    "fix",
    "docs",
    "chore",
    "refactor",
    "test",
    "build",
    "ci",
    "perf",
    "revert",
  ],
};

describe("parseCommitMessageArg", () => {
  it("returns null when no commit message argument is provided", () => {
    const result = parseCommitMessageArg(["node", "validate-commit"]);

    expect(result).toBeNull();
  });

  it("returns null when commit message argument is whitespace only", () => {
    const result = parseCommitMessageArg(["node", "validate-commit", "   "]);

    expect(result).toBeNull();
  });

  it("returns the commit message from argv", () => {
    const result = parseCommitMessageArg([
      "node",
      "validate-commit",
      "feat(cli):",
      "YLDTE-9",
      "add",
      "cli",
      "wrapper",
    ]);

    expect(result).toBe("feat(cli): YLDTE-9 add cli wrapper");
  });
});

describe("runCli", () => {
  it("returns exit code 1 when no commit message is provided", () => {
    const validate = vi.fn<
      (message: string, config: CommitPolicyConfig) => CommitValidationResult
    >();

    const dependencies: CliDependencies = {
      loadConfig: () => testConfig,
      validate,
    };

    const result = runCli(["node", "validate-commit"], dependencies);

    expect(result.exitCode).toBe(1);
    expect(validate).not.toHaveBeenCalled();
  });

  it("returns exit code 1 when commit message argument is whitespace only", () => {
    const validate = vi.fn<
      (message: string, config: CommitPolicyConfig) => CommitValidationResult
    >();

    const dependencies: CliDependencies = {
      loadConfig: () => testConfig,
      validate,
    };

    const result = runCli(["node", "validate-commit", "   "], dependencies);

    expect(result.exitCode).toBe(1);
    expect(validate).not.toHaveBeenCalled();
  });

  it("returns exit code 1 for unknown command", () => {
    const validate = vi.fn<
      (message: string, config: CommitPolicyConfig) => CommitValidationResult
    >();

    const dependencies: CliDependencies = {
      loadConfig: () => testConfig,
      validate,
    };

    const result = runCli(["node", "unknown-command"], dependencies);

    expect(result.exitCode).toBe(1);
    expect(validate).not.toHaveBeenCalled();
  });

  it("invokes validator with parsed commit message and config", () => {
    const validate = vi.fn<
      (message: string, config: CommitPolicyConfig) => CommitValidationResult
    >().mockReturnValue({
      valid: true,
      errors: [],
    });

    const dependencies: CliDependencies = {
      loadConfig: () => testConfig,
      validate,
    };

    runCli(
      ["node", "validate-commit", "feat(cli):", "YLDTE-9", "add", "cli", "wrapper"],
      dependencies
    );

    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith(
      "feat(cli): YLDTE-9 add cli wrapper",
      testConfig
    );
  });

  it("returns exit code 0 for a valid commit message", () => {
    const dependencies: CliDependencies = {
      loadConfig: () => testConfig,
      validate: vi.fn().mockReturnValue({
        valid: true,
        errors: [],
      }),
    };

    const result = runCli(
      ["node", "validate-commit", "feat(cli):", "YLDTE-9", "add", "cli", "wrapper"],
      dependencies
    );

    expect(result.exitCode).toBe(0);
  });

  it("returns exit code 0 for a valid commit message passed as a single argument", () => {
    const dependencies: CliDependencies = {
      loadConfig: () => testConfig,
      validate: vi.fn().mockReturnValue({
        valid: true,
        errors: [],
      }),
    };

    const result = runCli(
      ["node", "validate-commit", "feat(cli): YLDTE-9 add cli wrapper"],
      dependencies
    );

    expect(result.exitCode).toBe(0);
  });

  it("returns exit code 1 for an invalid commit message", () => {
    const dependencies: CliDependencies = {
      loadConfig: () => testConfig,
      validate: vi.fn().mockReturnValue({
        valid: false,
        errors: ["INVALID_FORMAT"],
      }),
    };

    const result = runCli(
      ["node", "validate-commit", "bad", "message"],
      dependencies
    );

    expect(result.exitCode).toBe(1);
  });

  it("is deterministic for the same input", () => {
    const dependencies: CliDependencies = {
      loadConfig: () => testConfig,
      validate: vi.fn().mockReturnValue({
        valid: true,
        errors: [],
      }),
    };

    const argv = [
      "node",
      "validate-commit",
      "feat(cli):",
      "YLDTE-9",
      "add",
      "cli",
      "wrapper",
    ];

    const first = runCli(argv, dependencies);
    const second = runCli(argv, dependencies);

    expect(first).toEqual(second);
  });
});