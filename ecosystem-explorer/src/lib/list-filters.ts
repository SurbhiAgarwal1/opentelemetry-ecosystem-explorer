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

export type Density = "cards" | "compact" | "table";
export type SortOption = "name" | "updated" | "stability";

export interface ListFilters {
  q: string;
  type: string[];
  signal: string[];
  stability: string[];
  distribution: string[];
  version: string | null;
  sort: SortOption;
  density: Density;
  page: number;
}

export const DEFAULT_FILTERS: ListFilters = {
  q: "",
  type: [],
  signal: [],
  stability: [],
  distribution: [],
  version: null,
  sort: "name",
  density: "compact",
  page: 1,
};

/**
 * Parses URLSearchParams into a typed ListFilters object.
 * Multiple values for the same key (e.g. ?type=receiver&type=processor)
 * are correctly parsed into arrays.
 */
export function parseListFilters(searchParams: URLSearchParams): ListFilters {
  const filters: ListFilters = { ...DEFAULT_FILTERS };

  const q = searchParams.get("q");
  if (q !== null) filters.q = q;

  filters.type = searchParams.getAll("type");
  filters.signal = searchParams.getAll("signal");
  filters.stability = searchParams.getAll("stability");
  filters.distribution = searchParams.getAll("distribution");

  const version = searchParams.get("version");
  if (version !== null) filters.version = version;

  const sort = searchParams.get("sort") as SortOption;
  if (["name", "updated", "stability"].includes(sort)) {
    filters.sort = sort;
  }

  const density = searchParams.get("density") as Density;
  if (["cards", "compact", "table"].includes(density)) {
    filters.density = density;
  }

  const pageStr = searchParams.get("page");
  if (pageStr) {
    const page = parseInt(pageStr, 10);
    if (!isNaN(page) && page > 0) {
      filters.page = page;
    }
  }

  return filters;
}

/**
 * Serializes a ListFilters object into a record suitable for URLSearchParams.
 * Only non-default values are included to keep the URL clean.
 */
export function serializeListFilters(filters: ListFilters): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  if (filters.q !== DEFAULT_FILTERS.q) {
    params.q = filters.q;
  }

  if (filters.type.length > 0) {
    params.type = filters.type;
  }

  if (filters.signal.length > 0) {
    params.signal = filters.signal;
  }

  if (filters.stability.length > 0) {
    params.stability = filters.stability;
  }

  if (filters.distribution.length > 0) {
    params.distribution = filters.distribution;
  }

  if (filters.version !== DEFAULT_FILTERS.version && filters.version !== null) {
    params.version = filters.version;
  }

  if (filters.sort !== DEFAULT_FILTERS.sort) {
    params.sort = filters.sort;
  }

  if (filters.density !== DEFAULT_FILTERS.density) {
    params.density = filters.density;
  }

  if (filters.page !== DEFAULT_FILTERS.page) {
    params.page = filters.page.toString();
  }

  return params;
}
