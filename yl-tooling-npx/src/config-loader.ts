import fs from "node:fs";
import path from "node:path";
import type {
  CommitPolicyConfig,
  CommitRegexFile,
  CommitTypesFile,
} from "./types";

/**
 * Resolves the default commit policy directory.
 *
 * Expected monorepo layout:
 * yl-commit-policy/
 * ├─ yl-commit-policy/
 * └─ yl-tooling-npx/
 */
function resolveDefaultPolicyDir(): string {
  return path.resolve(__dirname, "..", "..", "yl-commit-policy");
}

function readJsonFile<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing config file: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Invalid JSON in config file: ${filePath}`);
  }
}

function assertValidRegexFile(
  value: unknown,
  filePath: string
): asserts value is CommitRegexFile {
  if (
    typeof value !== "object" ||
    value === null ||
    !("pattern" in value) ||
    typeof (value as { pattern?: unknown }).pattern !== "string" ||
    (value as { pattern: string }).pattern.trim() === ""
  ) {
    throw new Error(
      `Invalid config structure in ${filePath}: expected { "pattern": "<regex>", "flags"?: "<flags>" }`
    );
  }

  if (
    "flags" in value &&
    typeof (value as { flags?: unknown }).flags !== "undefined" &&
    typeof (value as { flags?: unknown }).flags !== "string"
  ) {
    throw new Error(
      `Invalid config structure in ${filePath}: expected optional string "flags"`
    );
  }
}

function assertValidTypesFile(
  value: unknown,
  filePath: string
): asserts value is CommitTypesFile {
  if (
    typeof value !== "object" ||
    value === null ||
    !("types" in value) ||
    !Array.isArray((value as { types?: unknown }).types) ||
    (value as { types: unknown[] }).types.length === 0 ||
    (value as { types: unknown[] }).types.some(
      (item) => typeof item !== "string" || item.trim() === ""
    )
  ) {
    throw new Error(
      `Invalid config structure in ${filePath}: expected { "types": string[] }`
    );
  }
}

function assertRegexCompiles(
  pattern: string,
  flags: string,
  filePath: string
): void {
  try {
    new RegExp(pattern, flags);
  } catch {
    throw new Error(`Invalid regex pattern in ${filePath}: ${pattern}`);
  }
}

export function loadCommitPolicyConfig(policyDir?: string): CommitPolicyConfig {
  const baseDir = policyDir ?? resolveDefaultPolicyDir();

  const regexFilePath = path.join(baseDir, "commit-regex.json");
  const typesFilePath = path.join(baseDir, "commit-types.json");

  const regexJson = readJsonFile<unknown>(regexFilePath);
  const typesJson = readJsonFile<unknown>(typesFilePath);

  assertValidRegexFile(regexJson, regexFilePath);
  assertValidTypesFile(typesJson, typesFilePath);

  const flags = regexJson.flags ?? "";

  assertRegexCompiles(regexJson.pattern, flags, regexFilePath);

  return {
    pattern: regexJson.pattern,
    flags,
    allowedTypes: [...new Set(typesJson.types.map((type) => type.trim()))],
  };
}