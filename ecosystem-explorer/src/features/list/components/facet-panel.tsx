/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ListFilters } from "@/lib/list-filters";
import { SearchFacet } from "./facets/search-facet";
import { CheckboxFacet } from "./facets/checkbox-facet";
import { SelectFacet } from "./facets/select-facet";
import { Filter } from "lucide-react";

interface FacetPanelProps {
  filters: ListFilters;
  onChange: (updates: Partial<ListFilters>) => void;
  counts?: {
    type: Record<string, number>;
    signal: Record<string, number>;
    stability: Record<string, number>;
  };
}

export function FacetPanel({ filters, onChange, counts }: FacetPanelProps) {
  const handleFacetChange = (key: keyof ListFilters, value: string) => {
    const current = filters[key] as string[];
    if (current.includes(value)) {
      onChange({ [key]: current.filter((v) => v !== value) });
    } else {
      onChange({ [key]: [...current, value] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 pb-2">
        <Filter className="text-primary h-4 w-4" />
        <h2 className="text-sm font-bold tracking-widest uppercase">Filters</h2>
      </div>

      <SearchFacet
        title="Search"
        value={filters.q}
        onChange={(q) => onChange({ q })}
        placeholder="Filter by name..."
      />

      <CheckboxFacet
        title="Type"
        options={[
          { label: "Receiver", value: "receiver", count: counts?.type.receiver },
          { label: "Processor", value: "processor", count: counts?.type.processor },
          { label: "Exporter", value: "exporter", count: counts?.type.exporter },
          { label: "Connector", value: "connector", count: counts?.type.connector },
          { label: "Extension", value: "extension", count: counts?.type.extension },
        ]}
        selected={filters.type}
        onChange={(v) => handleFacetChange("type", v)}
      />

      <CheckboxFacet
        title="Signal"
        options={[
          { label: "Traces", value: "traces", count: counts?.signal.traces },
          { label: "Metrics", value: "metrics", count: counts?.signal.metrics },
          { label: "Logs", value: "logs", count: counts?.signal.logs },
        ]}
        selected={filters.signal}
        onChange={(v) => handleFacetChange("signal", v)}
      />

      <CheckboxFacet
        title="Stability"
        options={[
          { label: "Stable", value: "stable", count: counts?.stability.stable },
          { label: "Beta", value: "beta", count: counts?.stability.beta },
          { label: "Alpha", value: "alpha", count: counts?.stability.alpha },
          { label: "Deprecated", value: "deprecated", count: counts?.stability.deprecated },
        ]}
        selected={filters.stability}
        onChange={(v) => handleFacetChange("stability", v)}
      />

      <SelectFacet
        title="Version"
        options={[]} // To be populated by parent
        value={filters.version}
        onChange={(version) => onChange({ version })}
        placeholder="Select version"
      />
    </div>
  );
}
