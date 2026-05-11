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

import React from "react";
import { LayoutGrid, List, Table, ChevronDown } from "lucide-react";
import { Density, SortOption } from "@/lib/list-filters";

interface DensityToggleProps {
  value: Density;
  onChange: (value: Density) => void;
}

export function DensityToggle({ value, onChange }: DensityToggleProps) {
  const options: { value: Density; icon: React.ReactNode; label: string }[] = [
    { value: "compact", icon: <List className="h-4 w-4" />, label: "Compact" },
    { value: "cards", icon: <LayoutGrid className="h-4 w-4" />, label: "Cards" },
    { value: "table", icon: <Table className="h-4 w-4" />, label: "Table" },
  ];

  return (
    <div className="bg-muted/40 flex items-center rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={opt.label}
        >
          {opt.icon}
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const options: { value: SortOption; label: string }[] = [
    { value: "name", label: "Name" },
    { value: "updated", label: "Recently updated" },
    { value: "stability", label: "Stability" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs font-medium">Sort by:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="border-border/60 bg-background/80 focus:border-primary/50 focus:ring-primary/20 cursor-pointer appearance-none rounded-lg border py-1.5 pr-8 pl-3 text-xs font-semibold transition-all duration-200 focus:ring-2 focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
