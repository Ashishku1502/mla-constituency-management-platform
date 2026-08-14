"use client";

import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClasses =
    STATUS_COLORS[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium text-xs px-2.5 py-0.5 rounded-full border-0",
        colorClasses,
        className
      )}
    >
      {status}
    </Badge>
  );
}
