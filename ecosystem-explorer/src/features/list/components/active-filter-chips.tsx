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

import { X } from "lucide-react";
import type { ListFilters } from "@/lib/list-filters";

interface ActiveFilterChipsProps {
  filters: ListFilters;
  onRemove: (key: keyof ListFilters, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({ filters, onRemove, onClearAll }: ActiveFilterChipsProps) {
  const activeChips: { key: keyof ListFilters; value: string; label: string }[] = [];

  if (filters.q) {
    activeChips.push({ key: "q", value: filters.q, label: `Search: ${filters.q}` });
  }

  filters.type.forEach((v) => activeChips.push({ key: "type", value: v, label: v }));
  filters.signal.forEach((v) => activeChips.push({ key: "signal", value: v, label: v }));
  filters.stability.forEach((v) => activeChips.push({ key: "stability", value: v, label: v }));
  filters.distribution.forEach((v) =>
    activeChips.push({ key: "distribution", value: v, label: v })
  );

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeChips.map((chip) => (
        <span
          key={`${chip.key}-${chip.value}`}
          className="bg-secondary/10 border-secondary/20 text-secondary flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
        >
          {chip.label}
          <button
            onClick={() => onRemove(chip.key, chip.value)}
            className="hover:bg-secondary/20 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-muted-foreground hover:text-foreground ml-2 text-xs font-semibold underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
