"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { NAVIGATION } from "@/lib/constants";
import { useState } from "react";

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { label: string; href: string }[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;

    let label = segment
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

    for (const item of NAVIGATION) {
      if (item.href === currentPath) {
        label = item.title;
        break;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.href === currentPath) {
            label = child.title;
            break;
          }
        }
      }
    }

    crumbs.push({ label, href: currentPath });
  }

  return crumbs;
}

export function AppHeader() {
  const crumbs = useBreadcrumbs();
  const [isDark, setIsDark] = useState(false);
  const unreadCount = 4;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 px-4
                       border-b border-border/50
                       bg-background/80 backdrop-blur-xl
                       shadow-sm shadow-black/[0.04]
                       supports-[backdrop-filter]:bg-background/60">

      {/* Subtle top gradient line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
      <Separator orientation="vertical" className="h-5 bg-border/60" />

      {/* Mobile page title (visible only below sm breakpoint) */}
      {crumbs.length > 0 && (
        <span className="sm:hidden text-sm font-semibold text-foreground truncate max-w-[160px]">
          {crumbs[crumbs.length - 1].label}
        </span>
      )}

      {/* Breadcrumbs (hidden below sm) */}
      <nav className="hidden sm:flex items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
            <span
              className={
                index === crumbs.length - 1
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
        {/* Gold accent dot for current page */}
        {crumbs.length > 0 && (
          <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_80)] animate-pulse" />
        )}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground
                     hover:bg-primary/8 transition-all duration-200"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground
                     hover:bg-primary/8 transition-all duration-200"
          onClick={toggleTheme}
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications with animated badge */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground
                     hover:bg-primary/8 relative transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <>
              {/* Ping animation ring */}
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.62_0.2_25)] opacity-60 animate-ping" />
              </span>
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full px-1
                                text-[10px] font-bold
                                bg-gradient-to-br from-[oklch(0.62_0.2_25)] to-[oklch(0.55_0.24_20)]
                                text-white border-2 border-background
                                flex items-center justify-center shadow-sm">
                {unreadCount}
              </Badge>
            </>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1 bg-border/60" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-8 gap-2 px-2 rounded-lg hover:bg-primary/8 transition-all duration-200"
              />
            }
          >
            <Avatar className="h-6 w-6 ring-2 ring-[oklch(0.78_0.16_80/0.6)] ring-offset-1 ring-offset-background transition-all duration-200">
              <AvatarFallback className="text-[10px] font-bold
                                         bg-gradient-to-br from-[oklch(0.78_0.16_80)] to-[oklch(0.72_0.18_55)]
                                         text-[oklch(0.14_0.08_75)]">
                AS
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-semibold text-foreground">
              Amarinder S.
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border/60 shadow-xl shadow-black/10 p-1.5">
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 ring-2 ring-[oklch(0.78_0.16_80/0.5)]">
                  <AvatarFallback className="text-xs font-bold
                                              bg-gradient-to-br from-[oklch(0.78_0.16_80)] to-[oklch(0.72_0.18_55)]
                                              text-[oklch(0.14_0.08_75)]">
                    AS
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">Amarinder Singh</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-[oklch(0.78_0.16_80)]" />
                    Candidate
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1 bg-border/60" />
            <DropdownMenuItem className="rounded-lg cursor-pointer text-sm gap-2.5 px-3 py-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer text-sm gap-2.5 px-3 py-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-1 bg-border/60" />
            <DropdownMenuItem className="rounded-lg cursor-pointer text-sm gap-2.5 px-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/8">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
