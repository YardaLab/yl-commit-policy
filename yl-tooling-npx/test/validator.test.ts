import { describe, it, expect } from "vitest";
import { validateCommit } from "../src/validator";
import type { CommitPolicyConfig } from "../src/types";

const testConfig: CommitPolicyConfig = {
  pattern: "^(\\w+)\\(([\\w\\-]+)\\):\\s([A-Z]+-\\d+)\\s(.+)$",
  flags: "",
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

describe("validator", () => {
  it("accepts a valid commit", () => {
    const result = validateCommit(
      "feat(auth): YLC-42 add token validation",
      testConfig
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("accepts a valid commit with surrounding whitespace", () => {
    const result = validateCommit(
      "  feat(auth): YLC-42 add token validation  ",
      testConfig
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("accepts scope with hyphen", () => {
    const result = validateCommit(
      "feat(auth-api): YLC-42 add token validation",
      testConfig
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects invalid format", () => {
    const result = validateCommit("invalid message", testConfig);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("rejects empty message", () => {
    const result = validateCommit("", testConfig);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("EMPTY_MESSAGE");
  });

  it("rejects whitespace-only message", () => {
    const result = validateCommit("   ", testConfig);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("EMPTY_MESSAGE");
  });

  it("rejects missing scope", () => {
    const result = validateCommit(
      "feat: YLC-42 add token validation",
      testConfig
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("rejects missing ticket", () => {
    const result = validateCommit(
      "feat(auth): add token validation",
      testConfig
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("rejects invalid ticket format", () => {
    const result = validateCommit(
      "feat(auth): ylc-42 add token validation",
      testConfig
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("rejects missing description", () => {
    const result = validateCommit("feat(auth): YLC-42", testConfig);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("rejects malformed structure", () => {
    const result = validateCommit(
      "feat auth YLC-42 add token validation",
      testConfig
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("returns parsed fields for valid commit", () => {
    const result = validateCommit(
      "feat(auth): YLC-42 add token validation",
      testConfig
    );

    expect(result.valid).toBe(true);
    expect(result.parsed).toEqual({
      type: "feat",
      scope: "auth",
      ticket: "YLC-42",
      description: "add token validation",
    });
  });

  it("is deterministic for the same input", () => {
    const message = "feat(auth): YLC-42 add token validation";

    const first = validateCommit(message, testConfig);
    const second = validateCommit(message, testConfig);

    expect(first).toEqual(second);
  });

  it("fails for unsupported commit type", () => {
    const result = validateCommit(
      "homelander(core): YLDTE-1 test",
      testConfig
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_TYPE");
  });

  it("fails for uppercase commit type", () => {
    const result = validateCommit("FEAT(core): YLDTE-1 test", testConfig);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_TYPE");
  });

  it("passes for allowed commit types", () => {
    const result = validateCommit("feat(core): YLDTE-1 test", testConfig);

    expect(result.valid).toBe(true);
  });

  it("returns INVALID_FORMAT for malformed commit with unsupported type", () => {
    const result = validateCommit("homelander(): YLDTE-1 ", testConfig);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("rejects message with only newline", () => {
    const result = validateCommit("\n", testConfig);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("EMPTY_MESSAGE");
  });

  it("handles BOM correctly", () => {
    const result = validateCommit("\uFEFFfeat(core): YLDTE-1 test", testConfig);

    expect(result.valid).toBe(true);
  });
});