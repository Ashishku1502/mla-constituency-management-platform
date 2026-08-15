"use client";

import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  action,
  children,
}: PageHeaderProps) {
  const ActionIcon = action?.icon || Plus;

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 sm:mt-0">
        {children}
        {action && (
          <Button asChild size="sm" className="gap-1.5">
            <Link href={action.href}>
              <ActionIcon className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
