import { describe, it, expect } from "vitest";
import { validateCommit } from "../src/validator";

describe("validator", () => {
  it("accepts a valid commit", () => {
    const result = validateCommit("feat(auth): YLC-42 add token validation");

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects invalid format", () => {
    const result = validateCommit("invalid message");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("rejects empty message", () => {
    const result = validateCommit("");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("EMPTY_MESSAGE");
  });

  it("rejects missing scope", () => {
    const result = validateCommit("feat: YLC-42 add token validation");

    expect(result.valid).toBe(false);
  });

  it("rejects missing ticket", () => {
    const result = validateCommit("feat(auth): add token validation");

    expect(result.valid).toBe(false);
  });

  it("rejects invalid ticket format", () => {
    const result = validateCommit("feat(auth): ylc-42 add token validation");

    expect(result.valid).toBe(false);
  });

  it("rejects missing description", () => {
    const result = validateCommit("feat(auth): YLC-42");

    expect(result.valid).toBe(false);
  });

  it("rejects malformed structure", () => {
    const result = validateCommit("feat auth YLC-42 add token validation");

    expect(result.valid).toBe(false);
  });

  it("is deterministic for the same input", () => {
    const message = "feat(auth): YLC-42 add token validation";

    const first = validateCommit(message);
    const second = validateCommit(message);

    expect(first).toEqual(second);
  });
});
