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
import { ChevronDown } from "lucide-react";

interface FacetOption {
  label: string;
  value: string;
}

interface SelectFacetProps {
  title: string;
  options: FacetOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SelectFacet({ title, options, value, onChange, placeholder }: SelectFacetProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-foreground text-xs font-bold tracking-widest uppercase opacity-70">
        {title}
      </h3>
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="border-border/60 bg-background/80 focus:border-primary/50 focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-lg border py-2 pr-10 pl-3 text-sm font-medium transition-all duration-200 focus:ring-2 focus:outline-none"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
