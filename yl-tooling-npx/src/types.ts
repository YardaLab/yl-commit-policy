export type CommitParsed = {
  type: string;
  scope: string;
  ticket: string;
  description: string;
};

export type CommitError =
  | "EMPTY_MESSAGE"
  | "INVALID_FORMAT"
  | "MISSING_TYPE"
  | "MISSING_SCOPE"
  | "MISSING_TICKET"
  | "MISSING_DESCRIPTION";

export type CommitValidationResult = {
  valid: boolean;
  errors: CommitError[];
  parsed?: CommitParsed;
};