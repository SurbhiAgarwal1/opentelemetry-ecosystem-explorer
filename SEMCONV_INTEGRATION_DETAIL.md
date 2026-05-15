# Technical Detail: Semantic Convention Integration (Issue #97)

This document provides a technical deep-dive into the implementation of the Semantic Convention
compliance pipeline in the `explorer-db-builder`.

## 1. Architectural Overview

The integration follows a "sidecar" enrichment pattern. Instead of modifying the core data
structures, we introduce a `SemconvEnricher` that evaluates telemetry metadata against
standard OTel registries using the **OpenTelemetry Weaver** engine.

### Data Flow

1. **Extraction**: Retrieve metrics and spans from the normalized `InstrumentationData`.
2. **Translation**: Map OTel signals to a Weaver-compatible "Application Registry".
3. **Evaluation**: Execute `weaver registry check` against a specific semconv version.
4. **Annotation**: Persist compliance status back to the telemetry metadata.

## 2. Component: `SemconvEnricher`

**Location**: `explorer_db_builder/semconv_enricher.py`

This is the primary orchestrator for compliance checking.

### Transformation Logic

The enricher generates a temporary directory containing:

- **`manifest.yaml`**: Defines the instrumentation name and the dependency on the official
  OTel semantic convention registry (e.g., `github.com/open-telemetry/semantic-conventions@v1.37.0`).
- **`telemetry.yaml`**: Translates internal metadata into Weaver's definition format.
  - **Metrics**: Defined with `type: metric` and attributes using the `ref` keyword to ensure
    Weaver validates them against the registry's definitions.
  - **Spans**: Defined with `type: span`, using synthetic IDs based on the instrumentation
    name and span kind (e.g., `activej-http.SERVER`).

### Weaver Invocation

The enricher calls the `weaver` CLI via a subprocess.

- **Success Condition**: If `weaver registry check` exits with code 0, all signals defined in
  the registry are considered compliant.
- **Error Handling**: If errors are reported (return code 1), the enricher parses the `stderr`
  output to identify specific signals that failed validation and marks them accordingly.

## 3. Pipeline Integration

**Location**: `explorer_db_builder/main.py`

The enrichment stage is integrated into `process_version` immediately after the
`transform_instrumentation_format` call.

```python
transformed_inventory = transform_instrumentation_format(inventory)

# Enrich with semantic convention compliance
try:
    enricher = SemconvEnricher()
    enricher.enrich_inventory(transformed_inventory)
except Exception as e:
    logger.warning(f"Semantic convention enrichment failed: {e}")
```

This placement ensures that:

- Enrichment works on normalized, clean data.
- The pipeline remains resilient (a Weaver failure does not crash the build).

## 4. Frontend & Metadata Schema

**Location**: `ecosystem-explorer/src/types/javaagent.ts`

The compliance status is persisted as a `semconv_compliance` array on individual telemetry signals:

```json
{
  "name": "http.server.request.duration",
  "unit": "s",
  "semconv_compliance": ["1.37.0"]
}
```

This structure is extensible, allowing an instrumentation to be marked as compliant with multiple
semantic convention versions over time.

## 5. Verification & Testing

**Location**: `tests/test_semconv_enricher.py`

A dedicated test suite validates the following:

- **YAML Generation**: Ensures the generated `manifest.yaml` and `telemetry.yaml` are valid and
  follow Weaver's specification.
- **Version Extraction**: Tests the regex-based extraction of versions from OTel schema URLs.
- **Mocked CLI Interactions**: Simulates various Weaver output scenarios (total success, partial
  failure, and system errors) to verify that the metadata is updated correctly.

---
**Branch**: `feat/97-semconv-integration`  
**PR Title**: `feat(db-builder): integrate Weaver for semconv compliance checking (#97)`
