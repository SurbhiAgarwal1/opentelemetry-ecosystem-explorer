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


interface TypeStripeProps {
  type: string;
  className?: string;
}

export function TypeStripe({ type, className = "" }: TypeStripeProps) {
  const getColor = (t: string) => {
    switch (t.toLowerCase()) {
      case "receiver":
        return "bg-blue-500";
      case "processor":
        return "bg-purple-500";
      case "exporter":
        return "bg-orange-500";
      case "connector":
        return "bg-green-500";
      case "extension":
        return "bg-pink-500";
      default:
        return "bg-primary";
    }
  };

  return <div className={`w-1 rounded-full ${getColor(type)} ${className}`} aria-hidden="true" />;
}

interface StatusPillProps {
  status: string;
  className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const getStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case "stable":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "beta":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "alpha":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "deprecated":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${getStyles(status)} ${className}`}
    >
      {status}
    </span>
  );
}
