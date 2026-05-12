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

import { useMemo, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Loader2, Search } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { useCollectorVersions, useCollectorIndex } from "@/hooks/use-collector-data";
import { parseListFilters, serializeListFilters, DEFAULT_FILTERS } from "@/lib/list-filters";
import type { ListFilters, Density, SortOption } from "@/lib/list-filters";

import { FacetPanel } from "./components/facet-panel";
import { ActiveFilterChips } from "./components/active-filter-chips";
import { CompactView } from "./components/views/compact-view";
import { CardView } from "./components/views/card-view";
import { TableView } from "./components/views/table-view";
import { Pagination } from "./components/pagination";
import { DensityToggle, SortDropdown } from "./components/list-controls";

const PAGE_SIZE = 50;

export function ListPage() {
  const { ecosystem = "collector", version: urlVersion } = useParams<{
    ecosystem: string;
    version?: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => parseListFilters(searchParams), [searchParams]);

  const { data: versionData, loading: versionsLoading } = useCollectorVersions();

  const currentVersion = useMemo(() => {
    if (urlVersion) return urlVersion;
    if (filters.version) return filters.version;
    return versionData?.versions.find((v) => v.is_latest)?.version || "";
  }, [urlVersion, filters.version, versionData]);

  const { data: indexData, loading: indexLoading } = useCollectorIndex(currentVersion);

  const handleFilterChange = useCallback(
    (updates: Partial<ListFilters>) => {
      const newFilters = { ...filters, ...updates, page: updates.page ?? 1 };
      const params = serializeListFilters(newFilters);
      setSearchParams(params as Record<string, string | string[]>);
    },
    [filters, setSearchParams]
  );

  // Sync density to/from localStorage
  useEffect(() => {
    const savedDensity = localStorage.getItem("list-density") as Density;
    if (savedDensity && !searchParams.has("density")) {
      handleFilterChange({ density: savedDensity });
    }
  }, [handleFilterChange, searchParams]);

  useEffect(() => {
    if (filters.density) {
      localStorage.setItem("list-density", filters.density);
    }
  }, [filters.density]);

  const handleRemoveFilter = (key: keyof ListFilters, value: string) => {
    const current = filters[key];
    if (Array.isArray(current)) {
      handleFilterChange({ [key]: current.filter((v) => v !== value) });
    } else {
      handleFilterChange({ [key]: (DEFAULT_FILTERS as unknown as Record<string, unknown>)[key] });
    }
  };

  const filteredItems = useMemo(() => {
    if (!indexData) return [];

    const result = indexData.components.filter((item) => {
      const matchesSearch =
        !filters.q ||
        item.name.toLowerCase().includes(filters.q.toLowerCase()) ||
        item.display_name?.toLowerCase().includes(filters.q.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.q.toLowerCase());

      const matchesType = filters.type.length === 0 || filters.type.includes(item.type);
      const matchesStability =
        filters.stability.length === 0 ||
        (item.stability && filters.stability.includes(item.stability));
      const matchesDistribution =
        filters.distribution.length === 0 || filters.distribution.includes(item.distribution);

      return matchesSearch && matchesType && matchesStability && matchesDistribution;
    });

    // Sort
    result.sort((a, b) => {
      if (filters.sort === "name") {
        return (a.display_name || a.name).localeCompare(b.display_name || b.name);
      }
      // Other sort options to be implemented when data supports them
      return 0;
    });

    return result;
  }, [indexData, filters]);

  const paginatedItems = useMemo(() => {
    const start = (filters.page - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, filters.page]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);

  if (versionsLoading || (indexLoading && !indexData)) {
    return (
      <PageContainer>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  const baseUrl = `/${ecosystem}/components/${currentVersion}`;

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <FacetPanel
              filters={filters}
              onChange={handleFilterChange}
              counts={{
                type: {}, // Calculate counts from indexData
                signal: {},
                stability: {},
              }}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-6 lg:col-span-3">
          <header className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  Browse{" "}
                  <span className="from-secondary to-primary bg-gradient-to-r bg-clip-text text-transparent uppercase">
                    {ecosystem}
                  </span>
                </h1>
                <div className="text-muted-foreground text-sm font-medium">
                  Showing <span className="text-foreground">{filteredItems.length}</span> results
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <SortDropdown
                  value={filters.sort}
                  onChange={(sort) => handleFilterChange({ sort })}
                />
                <DensityToggle
                  value={filters.density}
                  onChange={(density) => handleFilterChange({ density })}
                />
              </div>
            </div>

            <ActiveFilterChips
              filters={filters}
              onRemove={handleRemoveFilter}
              onClearAll={() => setSearchParams({})}
            />
          </header>

          <section>
            {paginatedItems.length > 0 ? (
              <>
                {filters.density === "compact" && (
                  <CompactView items={paginatedItems} baseUrl={baseUrl} />
                )}
                {filters.density === "cards" && (
                  <CardView items={paginatedItems} baseUrl={baseUrl} />
                )}
                {filters.density === "table" && (
                  <TableView
                    items={paginatedItems}
                    baseUrl={baseUrl}
                    onSort={(s) => handleFilterChange({ sort: s as SortOption })}
                  />
                )}

                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={(page) => handleFilterChange({ page })}
                />
              </>
            ) : (
              <div className="border-border/40 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-32 text-center">
                <Search className="text-muted-foreground/20 mb-4 h-12 w-12" />
                <h3 className="text-xl font-semibold">No results found</h3>
                <p className="text-muted-foreground mt-2 max-w-xs">
                  We couldn't find anything matching your current filters. Try clearing some or
                  searching for something else.
                </p>
                <button
                  onClick={() => setSearchParams({})}
                  className="text-primary mt-6 text-sm font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </PageContainer>
  );
}
