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

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchFacetProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFacet({ title, value, onChange, placeholder }: SearchFacetProps) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 400); // 400ms debounce as per design guidelines for complex interactions

    return () => clearTimeout(timer);
  }, [localValue, value, onChange]);

  return (
    <div className="space-y-3">
      <h3 className="text-foreground text-xs font-bold tracking-widest uppercase opacity-70">
        {title}
      </h3>
      <div className="relative">
        <Search
          className="text-muted-foreground/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          className="border-border/60 bg-background/80 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border py-2 pr-10 pl-9 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
        {localValue && (
          <button
            onClick={() => setLocalValue("")}
            className="text-muted-foreground/40 hover:text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
