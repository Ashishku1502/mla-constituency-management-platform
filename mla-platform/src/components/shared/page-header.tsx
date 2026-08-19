import { isValidElement, type ReactNode, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon | ComponentType<any> | ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
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
            {isValidElement(Icon) ? (
              // Already a rendered JSX element: icon={<Settings />}
              Icon
            ) : typeof Icon === "function" || (typeof Icon === "object" && Icon !== null && ("render" in (Icon as object) || "$$typeof" in (Icon as object))) ? (
              // Component constructor (function) OR forwardRef component (object) like Lucide icons: icon={Settings}
              // @ts-expect-error Typescript can't infer this complex union
              <Icon className="h-5 w-5" />
            ) : (
              Icon
            )}
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
          action.href ? (
            <Button render={<Link href={action.href} />} size="sm" className="gap-1.5" onClick={action.onClick}>
              <ActionIcon className="h-4 w-4" />
              {action.label}
            </Button>
          ) : (
            <Button size="sm" className="gap-1.5" onClick={action.onClick}>
              <ActionIcon className="h-4 w-4" />
              {action.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
