# fix: add python-version-file to setup-python in nightly workflow

## What's wrong

The `nightly-registry-update.yml` workflow sets up Python without pinning it to the project's
declared version. This means the nightly job — the one that actually runs the watchers and writes to
the registry — runs on a different Python version than the one tested in CI.

The `setup-python` step in `nightly-registry-update.yml` has no `with` block:

```yaml
- name: Set up Python
  uses: actions/setup-python@a309ff8b426b58ec0e2a45f0f869d46889d02405 # v6.2.0
```

Compare this to `build-and-test.yml` which does it correctly:

```yaml
- name: Set up Python
  uses: actions/setup-python@a309ff8b426b58ec0e2a45f0f869d46889d02405 # v6.2.0
  with:
    python-version-file: ".python-version"
```

Without `python-version-file`, `setup-python` falls back to the GitHub runner's default Python
version, which is not guaranteed to match the project's pinned version.

## Why it matters

- The nightly job is the one that actually runs the watchers and updates the registry.
- Without this, it picks whatever Python the runner has by default, which may not match what we test
  against in CI.
- We are testing on one version and running in production on another.
- If the runner default ever changes, the nightly job silently starts using a different Python
  version with no indication in the workflow config.

## Fix

Added `python-version-file: ".python-version"` to the `setup-python` step in
`nightly-registry-update.yml` to match the pattern already used in both `build-and-test.yml` and
`build-explorer-database.yml`. One line change.

## File changed

- `.github/workflows/nightly-registry-update.yml`
