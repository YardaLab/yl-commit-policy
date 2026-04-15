import {
  CommitValidationResult,
  CommitError
} from "./types";

import commitTypes from "../../yl-commit-policy/commit-types.json";

const ALLOWED_TYPES = commitTypes.types;

const COMMIT_REGEX = /^(\w+)\(([\w\-]+)\):\s([A-Z]+-\d+)\s(.+)$/;
const WHITELIST_REGEX = /^(Merge|Revert) /;

export function validateCommit(message: string): CommitValidationResult {
  const normalized = message?.trim();

  // EMPTY
  if (!normalized) {
    return {
      valid: false,
      errors: ["EMPTY_MESSAGE"],
    };
  }

  // WHITELIST (git system commits)
  if (WHITELIST_REGEX.test(normalized)) {
    return {
      valid: true,
      errors: [],
      parsed: {
        type: "system",
        scope: "",
        ticket: "",
        description: normalized,
      },
    };
  }

  const match = normalized.match(COMMIT_REGEX);

  if (!match) {
    return {
      valid: false,
      errors: ["INVALID_FORMAT"],
    };
  }

  const [, type, scope, ticket, description] = match;

  const errors: CommitError[] = [];

  // TYPE VALIDATION
  if (!ALLOWED_TYPES.includes(type)) {
    errors.push("INVALID_TYPE");
  }

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