# refactor: explorer-db-builder should not import InventoryManager directly from java-instrumentation-watcher

## What's wrong

`explorer-db-builder` imports `InventoryManager` directly from the internals of
`java-instrumentation-watcher`:

```python
# ecosystem-automation/explorer-db-builder/src/explorer_db_builder/main.py, line 22
from java_instrumentation_watcher.inventory_manager import InventoryManager
```

This means `explorer-db-builder` (a consumer) is tightly coupled to the internal implementation of
`java-instrumentation-watcher` (a producer). The `pyproject.toml` for `explorer-db-builder` also
lists `java-instrumentation-watcher` as a direct dependency, which is architecturally backwards.

## Why it matters

- Any refactor of `java_instrumentation_watcher.inventory_manager` silently breaks the DB builder
- Adding a new watcher ecosystem in future requires changes in multiple places
- A consumer should not depend on a producer's internal class — it creates hidden coupling between
  two separate packages

## Suggested fix

Extract a shared `InventoryManager` interface or base class into `watcher-common`, which both the
watchers and `explorer-db-builder` can depend on. This way the DB builder depends on a stable shared
contract, not a watcher's internal implementation.

## Files affected

- `ecosystem-automation/explorer-db-builder/src/explorer_db_builder/main.py` — line 22
- `ecosystem-automation/explorer-db-builder/pyproject.toml` — lists `java-instrumentation-watcher`
  as a direct dependency
