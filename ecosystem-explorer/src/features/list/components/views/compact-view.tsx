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
import { Link } from "react-router-dom";
import { IndexComponent } from "@/types/collector";
import { TypeStripe, StatusPill } from "@/components/ui/foundation";

interface CompactViewProps {
  items: IndexComponent[];
  baseUrl: string;
}

export function CompactView({ items, baseUrl }: CompactViewProps) {
  return (
    <div className="border-border/30 bg-card/30 overflow-hidden rounded-xl border backdrop-blur-sm">
      <div className="divide-border/10 divide-y">
        {items.map((item, index) => (
          <Link
            key={item.id}
            to={`${baseUrl}/${item.id}`}
            className={`group hover:bg-muted/40 relative flex items-center gap-4 px-4 py-3 transition-colors ${
              index % 2 === 1 ? "bg-muted/20" : ""
            }`}
          >
            {/* Type Stripe */}
            <TypeStripe type={item.type} className="absolute left-0 h-3/5" />

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-foreground group-hover:text-primary truncate font-bold transition-colors">
                  {item.display_name || item.name}
                </span>
                <code className="text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5 font-mono text-[10px]">
                  {item.name}
                </code>
              </div>
              <p className="text-muted-foreground/70 line-clamp-1 text-xs">
                {item.description || "No description available."}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <span className="text-muted-foreground/60 hidden text-[10px] font-bold tracking-widest uppercase sm:block">
                {item.distribution}
              </span>
              <div className="flex w-20 justify-end">
                {item.stability && <StatusPill status={item.stability} />}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
