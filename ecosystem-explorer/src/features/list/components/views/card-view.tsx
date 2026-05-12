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

import { Link } from "react-router-dom";
import type { IndexComponent } from "@/types/collector";
import { DetailCard } from "@/components/ui/detail-card";
import { StatusPill } from "@/components/ui/foundation";
import { Box, Layers, Send, Plug, Workflow } from "lucide-react";

interface CardViewProps {
  items: IndexComponent[];
  baseUrl: string;
}

export function CardView({ items, baseUrl }: CardViewProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "receiver":
        return <Box className="h-5 w-5" />;
      case "processor":
        return <Layers className="h-5 w-5" />;
      case "exporter":
        return <Send className="h-5 w-5" />;
      case "extension":
        return <Plug className="h-5 w-5" />;
      case "connector":
        return <Workflow className="h-5 w-5" />;
      default:
        return <Box className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.id}
          to={`${baseUrl}/${item.id}`}
          className="group focus-visible:ring-primary block rounded-xl outline-none focus-visible:ring-2"
        >
          <DetailCard
            withHoverEffect
            className="border-border/50 group-hover:border-primary/30 h-full transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex h-full flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                  {getIcon(item.type)}
                </div>
                {item.stability && <StatusPill status={item.stability} />}
              </div>

              <div className="space-y-1.5">
                <h3 className="group-hover:text-primary text-lg font-bold transition-colors">
                  {item.display_name || item.name}
                </h3>
                <div className="flex items-center gap-2">
                  <code className="text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5 font-mono text-[11px]">
                    {item.name}
                  </code>
                  <span className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                    {item.distribution}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground/80 line-clamp-3 flex-1 text-sm leading-relaxed">
                {item.description ||
                  "Browse technical details and configuration options for this component."}
              </p>
            </div>
          </DetailCard>
        </Link>
      ))}
    </div>
  );
}
