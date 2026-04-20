import type {
  CommitValidationResult,
  CommitError,
  CommitPolicyConfig,
} from "./types";

const WHITELIST_REGEX = /^(Merge|Revert) /;

export function validateCommit(
  message: string,
  config: CommitPolicyConfig
): CommitValidationResult {
  const normalized = message?.trim();

  if (!normalized) {
    return {
      valid: false,
      errors: ["EMPTY_MESSAGE"],
    };
  }

  // Git system commits
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

  const commitRegex = new RegExp(config.pattern);
  const match = normalized.match(commitRegex);

  if (!match) {
    return {
      valid: false,
      errors: ["INVALID_FORMAT"],
    };
  }

  const [, type, scope, ticket, description] = match;

  const errors: CommitError[] = [];

  if (!type) errors.push("MISSING_TYPE");
  if (!scope) errors.push("MISSING_SCOPE");
  if (!ticket) errors.push("MISSING_TICKET");
  if (!description) errors.push("MISSING_DESCRIPTION");

  if (type && !config.allowedTypes.includes(type)) {
    errors.push("INVALID_TYPE");
  }

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