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

import { describe, it, expect } from "vitest";
import { parseListFilters, serializeListFilters, DEFAULT_FILTERS } from "./list-filters";

describe("list-filters", () => {
  describe("parseListFilters", () => {
    it("should parse empty params as defaults", () => {
      const params = new URLSearchParams();
      expect(parseListFilters(params)).toEqual(DEFAULT_FILTERS);
    });

    it("should parse search query", () => {
      const params = new URLSearchParams("q=test");
      const filters = parseListFilters(params);
      expect(filters.q).toBe("test");
    });

    it("should parse multi-value facets", () => {
      const params = new URLSearchParams("type=receiver&type=processor&signal=traces");
      const filters = parseListFilters(params);
      expect(filters.type).toEqual(["receiver", "processor"]);
      expect(filters.signal).toEqual(["traces"]);
    });

    it("should parse stability and distribution", () => {
      const params = new URLSearchParams("stability=stable&distribution=core");
      const filters = parseListFilters(params);
      expect(filters.stability).toEqual(["stable"]);
      expect(filters.distribution).toEqual(["core"]);
    });

    it("should parse sort, density and page", () => {
      const params = new URLSearchParams("sort=updated&density=table&page=3");
      const filters = parseListFilters(params);
      expect(filters.sort).toBe("updated");
      expect(filters.density).toBe("table");
      expect(filters.page).toBe(3);
    });

    it("should ignore invalid sort or density values", () => {
      const params = new URLSearchParams("sort=invalid&density=massive");
      const filters = parseListFilters(params);
      expect(filters.sort).toBe(DEFAULT_FILTERS.sort);
      expect(filters.density).toBe(DEFAULT_FILTERS.density);
    });

    it("should ignore invalid page values", () => {
      const params = new URLSearchParams("page=not-a-number");
      const filters = parseListFilters(params);
      expect(filters.page).toBe(DEFAULT_FILTERS.page);

      const params2 = new URLSearchParams("page=-5");
      const filters2 = parseListFilters(params2);
      expect(filters2.page).toBe(DEFAULT_FILTERS.page);
    });
  });

  describe("serializeListFilters", () => {
    it("should serialize to empty object if all are defaults", () => {
      expect(serializeListFilters(DEFAULT_FILTERS)).toEqual({});
    });

    it("should serialize changed filters", () => {
      const filters = {
        ...DEFAULT_FILTERS,
        q: "otel",
        type: ["receiver"],
        density: "table" as const,
      };
      const params = serializeListFilters(filters);
      expect(params).toEqual({
        q: "otel",
        type: ["receiver"],
        density: "table",
      });
    });

    it("should serialize multi-value facets as arrays", () => {
      const filters = {
        ...DEFAULT_FILTERS,
        type: ["receiver", "processor"],
      };
      const params = serializeListFilters(filters);
      expect(params).toEqual({
        type: ["receiver", "processor"],
      });
    });

    it("should not include defaults in serialization", () => {
      const filters = {
        ...DEFAULT_FILTERS,
        page: 1, // default
        sort: "name" as const, // default
      };
      expect(serializeListFilters(filters)).toEqual({});
    });
  });
});
