import { describe, it, expect } from "vitest";
import { validateCommit } from "../src/validator";

describe("validator", () => {
  it("valid commit", () => {
    const result = validateCommit("feat(auth): YLC-42 add token validation");

    expect(result.valid).toBe(true);
  });

  it("invalid format", () => {
    const result = validateCommit("invalid message");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FORMAT");
  });

  it("empty message", () => {
    const result = validateCommit("");

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("EMPTY_MESSAGE");
  });
});