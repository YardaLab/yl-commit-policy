# yl-tooling

YardaLab CLI for validating commit messages against the YardaLab commit policy.

This package is intended for developers and repositories that want a simple CLI for checking whether commit messages follow the documented YardaLab convention.

---

## What this package does

`yl-tooling` validates commit messages against the YardaLab commit policy and returns a success or failure result that can be used in local development workflows, git hooks, and CI validation.

It is primarily intended for:

* local commit validation during development
* `commit-msg` git hook integration
* scriptable validation inside CI or other automation

---

## Installation

### Run with npx (recommended)

Run without installing the package globally:

```bash
npx yl-tooling validate-commit "feat(core): YLDTE-11 add CLI"
```

### Local project install

Install as a project development dependency:

```bash
npm install --save-dev yl-tooling
```

Then run it with `npx`:

```bash
npx yl-tooling validate-commit "feat(core): YLDTE-11 add CLI"
```

### Global install (optional)

Install the package globally:

```bash
npm install --global yl-tooling
```

Then run:

```bash
yl-tooling validate-commit "feat(core): YLDTE-11 add CLI"
```

### Local development usage

When working inside the repository:

```bash
node bin/yl-tooling.js validate-commit "feat(core): YLDTE-11 add CLI"
```

---

## Usage

### Validate a commit message string

```bash
npx yl-tooling validate-commit "feat(core): YLDTE-11 add CLI"
```

### Validate a commit message file

This is useful for `commit-msg` hooks where Git passes the path to the commit message file.

```bash
npx yl-tooling validate-commit .git/COMMIT_EDITMSG
```

---

## Git Hook Integration

Example `commit-msg` hook usage:

```bash
#!/usr/bin/env bash
npx yl-tooling validate-commit "$1"
```

This allows Git to validate the commit message file before the commit is accepted.

---

## Commit Message Format

```text
<type>(<scope>): <TICKET> <description>
```

### Example valid commit

```text
feat(core): YLDTE-11 add CLI support
```

### Example invalid commit

```text
feature(core): YLDTE-11 invalid type
```

---

## Allowed Types

The current allowed commit types are:

* feat
* fix
* docs
* chore
* refactor
* test
* build
* ci
* perf
* revert

---

## Special Cases

The following commit types or patterns are accepted by policy handling:

* merge commits
* revert commits

The exact validation behavior is determined by the bundled default commit policy included with the package.

---

## Example Error Output

```text
ERROR: Invalid commit message

Message:
  feature(core): YLDTE-11 invalid type

Reasons:
  - INVALID_FORMAT

Expected format:
  <type>(<scope>): <TICKET> <description>

Example:
  feat(core): YLDTE-11 add validation
```

---

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

### Run locally

```bash
node bin/yl-tooling.js validate-commit "feat(core): YLDTE-11 test"
```

---

## Notes

* the CLI validates the first line of the commit message
* the commit body is ignored
* the package includes bundled default policy files required for runtime validation
* public package behavior should be considered the source of truth for consumers
