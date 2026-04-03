# yl-commit-policy

## Purpose

`yl-commit-policy` is the single source of truth for commit message rules across the YardaLab ecosystem.

It defines:

* commit message format (regex)
* allowed commit types
* example valid and invalid commit messages

This repository is consumed by:

* yl-tooling-npx (Node.js)
* yl-tooling-hex (Elixir)
* CI pipelines
* Git hooks

---

## Structure

```
yl-commit-policy/
├─ commit-regex.json
├─ commit-types.json
├─ examples/
│  ├─ valid.txt
│  └─ invalid.txt
└─ README.md
```

---

## Commit Format

All commit messages must follow this format:

```
<type>(scope): <TICKET> <description>
```

### Example

```
feat(auth): YLDTE-123 add login support
```

---

## Files

### commit-regex.json

Defines the regex pattern used to validate commit messages.

### commit-types.json

Defines the list of allowed commit types.

### examples/

Contains test data:

* `valid.txt` → valid commit messages
* `invalid.txt` → invalid commit messages

Each line represents a single test case.

---

## Design Principles

* single source of truth
* language-agnostic configuration
* no runtime logic
* reusable across tooling

---

## Notes

* validation logic is implemented in tooling packages
* this repository only defines rules and data
* all implementations must follow this policy

---

## Outcome

A centralized, consistent commit policy that ensures uniform commit messages across all YardaLab repositories.
