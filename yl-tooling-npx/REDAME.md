# yl-tooling

YardaLab CLI for enforcing commit message conventions.

Validates commit messages according to the YardaLab commit policy.

---

## Usage

### NPX (recommended)

```bash
npx yl-tooling validate-commit "feat(core): YLDTE-11 add CLI"
```

### Local (development)

```bash
node bin/yl-tooling.js validate-commit "feat(core): YLDTE-11 add CLI"
```

### Global (optional)

```bash
npm link
yl-tooling validate-commit "feat(core): YLDTE-11 add CLI"
```

---

## Git Hook (commit-msg)

Example usage inside a git hook:

```bash
yl-tooling validate-commit .git/COMMIT_EDITMSG
```

---

## Commit Format

```text
<type>(<scope>): <TICKET> <description>
```

### Example

```bash
feat(core): YLDTE-11 add CLI support
```

---

## Allowed Types

- feat
- fix
- chore
- refactor
- perf
- docs

---

## Special Cases

The following commits are automatically allowed:

- Merge commits
- Revert commits

---

## Error Output

Example invalid output:

```text
ERROR: Invalid commit message

Message:
  random

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

- This CLI validates only the first line of the commit message
- Commit body is ignored
- Direct configuration loading is temporary and will be refined in follow-up tasks
