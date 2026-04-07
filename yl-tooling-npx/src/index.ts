#!/usr/bin/env node

import * as fs from "fs";
import { execSync } from "child_process";

function getRepoRoot(): string {
  return execSync("git rev-parse --show-toplevel")
    .toString()
    .trim();
}

function loadCommitTypes(repoRoot: string): string {
  const typesPath = `${repoRoot}/yl-commit-policy/commit-types.json`;

  if (!fs.existsSync(typesPath)) {
    console.error(`❌ commit-types.json not found at ${typesPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(typesPath, "utf-8");
  const parsed = JSON.parse(raw);

  if (!parsed.types || !Array.isArray(parsed.types)) {
    console.error("❌ Invalid commit-types.json format");
    process.exit(1);
  }

  return parsed.types.join("|");
}

function main(): void {
  const [, , command, file] = process.argv;

  if (command !== "commit-check") {
    console.error("Unknown command");
    process.exit(1);
  }

  if (!file) {
    console.error("No commit message file provided");
    process.exit(1);
  }

  if (!fs.existsSync(file)) {
    console.error(`Commit message file not found: ${file}`);
    process.exit(1);
  }

  const content = fs.readFileSync(file, "utf-8");
  const firstLine = content.split(/\r?\n/)[0]?.trim() ?? "";

  const repoRoot = getRepoRoot();
  const types = loadCommitTypes(repoRoot);

  const pattern = new RegExp(
    `^(${types})\\([a-z][a-z0-9-]*\\): [A-Z][A-Z0-9]*-[0-9]+ .+`
  );

  if (!pattern.test(firstLine)) {
    console.error("Invalid commit format.");
    console.error("Expected:");
    console.error("  <type>(<scope>): <TICKET> <description>");
    console.error("");
    console.error("Allowed types:");
    console.error(`  ${types.replace(/\|/g, " | ")}`);
    console.error("");
    console.error("Example:");
    console.error("  feat(base): YLT-5 define canonical folder tree");
    process.exit(1);
  }

  process.exit(0);
}

main();