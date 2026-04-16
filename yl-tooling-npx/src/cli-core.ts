import type { CommitValidationResult } from "./types";

export interface CliDependencies {
  validate: (message: string) => CommitValidationResult;
}

export interface CliExecutionResult {
  exitCode: 0 | 1;
}

function resolveCommandIndex(argv: string[]): number {
  return argv.findIndex(arg => arg === "validate-commit");
}

export function parseCommitMessageArg(argv: string[]): string | null {
  const commandIndex = resolveCommandIndex(argv);

  if (commandIndex === -1) {
    return null;
  }

  const args = argv.slice(commandIndex + 1);

  if (args.length === 0) {
    return null;
  }

  const message = args.join(" ").trim();

  if (!message) {
    return null;
  }

  return message;
}

export function runCli(
  argv: string[],
  dependencies: CliDependencies,
): CliExecutionResult {
  const commandIndex = resolveCommandIndex(argv);

  if (commandIndex === -1) {
    return { exitCode: 1 };
  }

  const message = parseCommitMessageArg(argv);

  if (!message) {
    return { exitCode: 1 };
  }

  const result = dependencies.validate(message);

  if (!result.valid) {
    return { exitCode: 1 };
  }

  return { exitCode: 0 };
}
