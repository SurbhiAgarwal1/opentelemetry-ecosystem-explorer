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
import { useNavigate } from "react-router-dom";
import { IndexComponent } from "@/types/collector";
import { StatusPill } from "@/components/ui/foundation";
import { ArrowUpDown } from "lucide-react";

interface TableViewProps {
  items: IndexComponent[];
  baseUrl: string;
  onSort: (key: string) => void;
}

export function TableView({ items, baseUrl, onSort }: TableViewProps) {
  const navigate = useNavigate();

  return (
    <div className="border-border/30 bg-card/30 overflow-hidden rounded-xl border backdrop-blur-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-border/10 border-b bg-white/5">
            <th className="p-4 text-xs font-bold tracking-widest uppercase">
              <button
                onClick={() => onSort("name")}
                className="hover:text-primary flex items-center gap-2 transition-colors"
              >
                Name <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="hidden p-4 text-xs font-bold tracking-widest uppercase md:table-cell">
              Type
            </th>
            <th className="hidden p-4 text-xs font-bold tracking-widest uppercase lg:table-cell">
              Distribution
            </th>
            <th className="p-4 text-xs font-bold tracking-widest uppercase">Stability</th>
          </tr>
        </thead>
        <tbody className="divide-border/5 divide-y">
          {items.map((item, index) => (
            <tr
              key={item.id}
              onClick={() => navigate(`${baseUrl}/${item.id}`)}
              className={`hover:bg-muted/40 cursor-pointer transition-colors ${
                index % 2 === 1 ? "bg-muted/20" : ""
              }`}
            >
              <td className="p-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground font-semibold">
                    {item.display_name || item.name}
                  </span>
                  <code className="text-muted-foreground font-mono text-[10px]">{item.name}</code>
                </div>
              </td>
              <td className="hidden p-4 md:table-cell">
                <span className="text-muted-foreground text-sm uppercase">{item.type}</span>
              </td>
              <td className="hidden p-4 lg:table-cell">
                <span className="text-muted-foreground text-sm uppercase">{item.distribution}</span>
              </td>
              <td className="p-4">{item.stability && <StatusPill status={item.stability} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
