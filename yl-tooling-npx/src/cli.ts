#!/usr/bin/env node

import { existsSync, readFileSync } from "fs";
import kleur from "kleur";
import { runCli, parseCommitMessageArg } from "./cli-core";
import { loadCommitPolicyConfig } from "./config-loader";
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
  const parsedMessage = parseCommitMessageArg(argv);
  const config = loadCommitPolicyConfig();

  // FILE INPUT (git commit-msg hook)
  if (parsedMessage && existsSync(parsedMessage)) {
    const raw = readFileSync(parsedMessage, "utf8");
    const firstLine = raw.split(/\r?\n/)[0]?.trim() ?? "";
    const validation = validateCommit(firstLine, config);

    if (validation.valid) {
      console.log(kleur.green(`✔ ${VALID_MESSAGE}`));
      process.exit(0);
    }

    printError(firstLine, validation.errors);
    process.exit(1);
  }

  const result = runCli(argv, {
    loadConfig: () => config,
    validate: validateCommit,
  });

  if (result.exitCode === 0) {
    console.log(kleur.green(`✔ ${VALID_MESSAGE}`));
    process.exit(0);
  }

  const validation = validateCommit(parsedMessage ?? "", config);
  printError(parsedMessage ?? "", validation.errors);
  process.exit(1);
}

function printError(message: string, errors: string[]) {
  console.error(kleur.red("ERROR: Invalid commit message"));

  console.error("");
  console.error(kleur.white("Message:"));
  console.error(`  ${kleur.dim(message || '""')}`);

  if (errors.length > 0) {
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