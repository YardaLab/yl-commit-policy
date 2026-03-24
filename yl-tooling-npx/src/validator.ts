import {
  CommitValidationResult,
  CommitError
} from "./types";

const COMMIT_REGEX = /^(\w+)\(([\w\-]+)\):\s([A-Z]+-\d+)\s(.+)$/;

export function validateCommit(message: string): CommitValidationResult {
  const normalized = message?.trim();

  // EMPTY
  if (!normalized) {
    return {
      valid: false,
      errors: ["EMPTY_MESSAGE"],
    };
  }

  const match = normalized.match(COMMIT_REGEX);

  // INVALID FORMAT
  if (!match) {
    return {
      valid: false,
      errors: ["INVALID_FORMAT"],
    };
  }

  const [, type, scope, ticket, description] = match;

  const errors: CommitError[] = [];

  // EXTRA GUARDS (future-proofing + explicitness)
  if (!type) errors.push("MISSING_TYPE");
  if (!scope) errors.push("MISSING_SCOPE");
  if (!ticket) errors.push("MISSING_TICKET");
  if (!description) errors.push("MISSING_DESCRIPTION");

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    errors: [],
    parsed: {
      type,
      scope,
      ticket,
      description,
    },
  };
}