#!/usr/bin/env node

import { existsSync, readFileSync } from "fs";
import kleur from "kleur";
import { runCli, parseCommitMessageArg } from "./cli-core";
import { validateCommit } from "./validator";

/**
 * CLI entrypoint
 * - uses cli-core for parsing + execution
 * - handles IO (fs, console, process.exit)
 * - supports git hook file input
 */

const VALID_MESSAGE = "OK  Commit message is valid";

function main() {
  const argv = process.argv;

  const commandIndex = argv.findIndex(arg => arg === "validate-commit");
  const args = commandIndex !== -1 ? argv.slice(commandIndex + 1) : [];

  // =========================
  // FILE INPUT (git commit-msg hook)
  // =========================
  if (commandIndex !== -1 && args.length === 1 && existsSync(args[0])) {
    const raw = readFileSync(args[0], "utf8");
    const firstLine = raw.split(/\r?\n/)[0]?.trim() ?? "";

    const result = validateCommit(firstLine);

    if (result.valid) {
      console.log(kleur.green(`✔ ${VALID_MESSAGE}`));
      process.exit(0);
    }

    printError(firstLine, result.errors);
    process.exit(1);
  }

  // =========================
  // STANDARD CLI FLOW (delegated to cli-core)
  // =========================
  const result = runCli(argv, {
    validate: validateCommit,
  });

  if (result.exitCode === 0) {
    console.log(kleur.green(`✔ ${VALID_MESSAGE}`));
    process.exit(0);
  }

  // re-run for error details
  const parsedMessage = parseCommitMessageArg(argv) ?? "";
  const validation = validateCommit(parsedMessage);

  printError(parsedMessage, validation.errors);
  process.exit(1);
}

function printError(message: string, errors: string[]) {
  console.error(kleur.red("ERROR: Invalid commit message"));

  console.error("");
  console.error(kleur.white("Message:"));
  console.error(`  ${kleur.dim(message || '""')}`);

  if (errors && errors.length > 0) {
    console.error("");
    console.error(kleur.yellow("Reasons:"));

    for (const err of errors) {
      console.error(`  - ${kleur.red(err)}`);
    }
  }

  console.error("");
  console.error(kleur.dim("Expected format:"));
  console.error(kleur.dim("  <type>(<scope>): <TICKET> <description>"));

  console.error("");
  console.error(kleur.dim("Example:"));
  console.error(kleur.dim("  feat(core): YLDTE-11 add validation"));
}

main();