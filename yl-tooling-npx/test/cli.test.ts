import { describe, expect, it, vi } from "vitest";
import { parseCommitMessageArg, runCli, type CliDependencies } from "../src/cli";
import type { CommitValidationResult } from "../src/types";

describe("parseCommitMessageArg", () => {
  it("returns null when no commit message argument is provided", () => {
    const result = parseCommitMessageArg(["node", "commit-check"]);

    expect(result).toBeNull();
  });

  it("returns null when commit message is empty", () => {
    const result = parseCommitMessageArg(["node", "commit-check", "   "]);

    expect(result).toBeNull();
  });

  it("returns the commit message from argv", () => {
    const result = parseCommitMessageArg([
      "node",
      "commit-check",
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
    const validate = vi.fn<(_: string) => CommitValidationResult>();
    const dependencies: CliDependencies = { validate };

    const result = runCli(["node", "commit-check"], dependencies);

    expect(result.exitCode).toBe(1);
    expect(validate).not.toHaveBeenCalled();
  });

  it("invokes validator with parsed commit message", () => {
    const validate = vi.fn<(_: string) => CommitValidationResult>().mockReturnValue({
      valid: true,
      errors: [],
    });

    const dependencies: CliDependencies = { validate };

    runCli(
      ["node", "commit-check", "feat(cli):", "YLDTE-9", "add", "cli", "wrapper"],
      dependencies,
    );

    expect(validate).toHaveBeenCalledWith("feat(cli): YLDTE-9 add cli wrapper");
  });

  it("returns exit code 0 for a valid commit message", () => {
    const dependencies: CliDependencies = {
      validate: vi.fn().mockReturnValue({
        valid: true,
        errors: [],
      }),
    };

    const result = runCli(
      ["node", "commit-check", "feat(cli):", "YLDTE-9", "add", "cli", "wrapper"],
      dependencies,
    );

    expect(result.exitCode).toBe(0);
  });

  it("returns exit code 1 for an invalid commit message", () => {
    const dependencies: CliDependencies = {
      validate: vi.fn().mockReturnValue({
        valid: false,
        errors: ["INVALID_FORMAT"],
      }),
    };

    const result = runCli(
      ["node", "commit-check", "bad", "message"],
      dependencies,
    );

    expect(result.exitCode).toBe(1);
  });

  it("is deterministic for the same input", () => {
    const dependencies: CliDependencies = {
      validate: vi.fn().mockReturnValue({
        valid: true,
        errors: [],
      }),
    };

    const argv = [
      "node",
      "commit-check",
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