// src/index.ts
// Public API for yl-tooling (library usage)
// YLDTE-11 compliant: no CLI logic, no fs/exec, no config loading

export { validateCommit } from "./validator";
export type {
  CommitValidationResult,
  CommitError,
  CommitParsed,
} from "./types";
