import { validateCommit } from "./validator";
import type { CommitValidationResult } from "./types";

export interface CliDependencies {
  validate: (message: string) => CommitValidationResult;
}

export interface CliExecutionResult {
  exitCode: 0 | 1;
}

const defaultDependencies: CliDependencies = {
  validate: validateCommit,
};

export function parseCommitMessageArg(argv: string[]): string | null {
  const [, , ...args] = argv;

  if (args.length === 0) {
    return null;
  }

  const message = args.join(" ").trim();

  return message.length > 0 ? message : null;
}

export function runCli(
  argv: string[],
  dependencies: CliDependencies = defaultDependencies,
): CliExecutionResult {
  const commitMessage = parseCommitMessageArg(argv);

  if (commitMessage === null) {
    return { exitCode: 1 };
  }

  const result = dependencies.validate(commitMessage);

  return {
    exitCode: result.valid ? 0 : 1,
  };
}