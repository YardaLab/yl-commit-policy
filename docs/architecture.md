# YardaLab Tooling → Full Mapping (Repo + Files + Jira)

---

## Repository Structure

```
yardalab-tooling/
│
├─ .gitignore                                        # YLDTE-1
├─ README.md                                         # YLDTE-1
├─ LICENSE                                           # YLDTE-1
│
├─ yl-commit-policy/                                  # YLDTE-7
│   ├─ commit-regex.json                              # YLDTE-7
│   ├─ commit-types.json                              # YLDTE-7
│   ├─ version.json                                   # YLDTE-18
│   ├─ examples/
│   │   ├─ valid.txt                                  # YLDTE-7
│   │   └─ invalid.txt                                # YLDTE-7
│   └─ README.md                                      # YLDTE-7
│
├─ yl-tooling-npx/                                    # YLDTE-5
│   ├─ package.json                                   # YLDTE-11
│   ├─ package-lock.json                              # YLDTE-11
│   │
│   ├─ bin/
│   │   └─ commit-check.js                            # YLDTE-12
│   │
│   ├─ src/
│   │   ├─ index.ts                                   # YLDTE-12
│   │   ├─ validator.ts                               # YLDTE-8
│   │   ├─ config-loader.ts                           # YLDTE-18
│   │   ├─ cli.ts                                     # YLDTE-9
│   │
│   ├─ dist/                                          # YLDTE-11
│   ├─ tsconfig.json                                  # YLDTE-11
│   ├─ README.md                                      # YLDTE-5
│   │
│   ├─ test/                                          # YLDTE-10
│   │   ├─ validator.test.ts                          # YLDTE-8, YLDTE-10
│   │   └─ cli.test.ts                                # YLDTE-9, YLDTE-10
│   │
│   └─ .github/workflows/
│       └─ ci.yml                                     # YLDTE-14
│
├─ yl-tooling-hex/                                    # YLDTE-6
│   ├─ mix.exs                                        # YLDTE-16, YLDTE-22
│   ├─ README.md                                      # YLDTE-21
│   ├─ .formatter.exs                                 # YLDTE-16
│   ├─ .gitignore                                     # YLDTE-16
│   │
│   ├─ lib/
│   │   ├─ yl_tooling.ex                              # YLDTE-16
│   │   │
│   │   ├─ yl_tooling/
│   │   │   ├─ validator.ex                           # YLDTE-8, YLDTE-19
│   │   │   ├─ config_loader.ex                       # YLDTE-18
│   │   │   ├─ commit_reader.ex                       # YLDTE-17
│   │   │   └─ cli_output.ex                          # YLDTE-20
│   │   │
│   │   └─ mix/tasks/
│   │       └─ yl.commit.check.ex                     # YLDTE-17
│   │
│   ├─ priv/
│   │   └─ commit_policy/
│   │       └─ default.json                           # YLDTE-18
│   │
│   ├─ test/
│   │   ├─ validator_test.exs                         # YLDTE-8, YLDTE-19, YLDTE-10
│   │   ├─ config_loader_test.exs                     # YLDTE-18, YLDTE-10
│   │   ├─ commit_reader_test.exs                     # YLDTE-17, YLDTE-10
│   │   └─ mix_task_test.exs                          # YLDTE-17, YLDTE-10
│   │
│   └─ .github/workflows/
│       └─ ci.yml                                     # YLDTE-22
│
├─ docs/
│   ├─ commit-format.md                               # YLDTE-15
│   └─ architecture.md                                # YLDTE-4
│
└─ scripts/                                           # YLDTE-2
    ├─ validate-local.sh
    └─ release.sh
```

---

## Layer Responsibilities

* Validator (YLDTE-8)

  * pure logic
  * no IO
  * no config loading
  * defines validation behavior

* Config Loader (YLDTE-18)

  * loads commit-policy
  * validates version
  * prepares rules

* CLI (YLDTE-9, YLDTE-20)

  * argument parsing
  * validator invocation
  * exit code handling
  * output formatting
  * no business logic duplication

* CLI Entry (YLDTE-12)

  * runtime adapter
  * connects CLI to Node.js / NPX
  * no logic

---

## Dependencies (System Flow)

```text
YLDTE-8  (validator)
   ↓
YLDTE-9  (CLI)
   ↓
YLDTE-12 (entrypoint)
   ↓
YLDTE-23 (hooks)
```

### Additional Dependencies

* YLDTE-18 (config loader) is used by validator/CLI (not a linear step)

---

## Ticket → Responsibility Map

### CORE

YLDTE-1
→ root repo initialization

YLDTE-2
→ scripts + tooling helpers

YLDTE-3
→ yl-commit-policy repo

YLDTE-4
→ architecture.md (shared design)

YLDTE-7
→ regex definition

YLDTE-8
→ validation implementation (behavior only)

YLDTE-9
→ CLI flow

YLDTE-10
→ tests

---

### COMMIT POLICY

YLDTE-7

* commit-regex.json
* commit-types.json
* examples/

YLDTE-18

* version.json

---

### NPX PACKAGE

YLDTE-5
→ yl-tooling-npx (package)

YLDTE-11

* package.json
* tsconfig.json
* dist/

YLDTE-12

* bin/commit-check.js
* src/index.ts

YLDTE-8

* src/validator.ts

YLDTE-18

* src/config-loader.ts

YLDTE-9 / YLDTE-20

* src/cli.ts

YLDTE-10

* test/

YLDTE-14

* .github/workflows/ci.yml

---

### HEX PACKAGE

YLDTE-6
→ yl-tooling-hex (package)

YLDTE-16

* mix.exs
* .formatter.exs
* yl_tooling.ex

YLDTE-17

* mix/tasks/yl.commit.check.ex
* commit_reader.ex

YLDTE-18

* config_loader.ex
* priv/commit_policy/

YLDTE-19

* validator.ex (must match TS behavior)

YLDTE-20

* cli_output.ex

YLDTE-10

* test/

YLDTE-21

* README.md

YLDTE-22

* CI workflow

---

### DOCS

YLDTE-15

* docs/commit-format.md

YLDTE-4

* docs/architecture.md

---

## Rules

* File has one responsibility (layer ownership)
* Multiple tickets may modify a file, but must not violate its responsibility
* No cross-layer logic leakage
* No duplication of validation logic
* Code must be traceable to Jira tickets

---

## Reality Notes

* version.json is required for compatibility control
* validator implementations must remain identical in behavior across TS and Elixir
* TS and Elixir validators must produce identical results for identical inputs
* commit-policy is treated as a contract

---

## Final State

* every file has a clear responsibility
* no orphan responsibilities
* prepared for CI integration
* prepared for packaging
* prepared for scaling

---

## Known Risks

* divergence between TS and Elixir validator implementations
* missing commit-policy versioning
* accidental code sharing between NPX and Hex

These must be explicitly avoided.

---

## Tooling Dependency Flow

This section defines how commit validation flows through the system.

### Flow

```text
YLDTE-8  (validator)
   ↓
YLDTE-9  (CLI)
   ↓
YLDTE-12 (CLI entrypoint)
   ↓
YLDTE-23 (git hooks enforcement)
```

---

## Principle

System is complete only when validation is enforced, not just implemented.
