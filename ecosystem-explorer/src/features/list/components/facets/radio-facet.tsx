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

interface FacetOption {
  label: string;
  value: string;
  count?: number;
}

interface RadioFacetProps {
  title: string;
  options: FacetOption[];
  selected: string | null;
  onChange: (value: string) => void;
}

export function RadioFacet({ title, options, selected, onChange }: RadioFacetProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-foreground text-xs font-bold tracking-widest uppercase opacity-70">
        {title}
      </h3>
      <div className="space-y-1">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className="hover:bg-muted/40 group flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? "border-primary"
                      : "border-border bg-background group-hover:border-primary/50"
                  }`}
                >
                  {isSelected && <div className="bg-primary h-2 w-2 rounded-full" />}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {option.label}
                </span>
              </div>
              {option.count !== undefined && (
                <span className="text-muted-foreground/50 text-[10px] font-medium">
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
