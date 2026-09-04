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
  Palette,
  Globe,
} from "lucide-react";
import { NAVIGATION } from "@/lib/constants";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

import { useTranslation } from "@/hooks/use-translation";

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

const THEMES = [
  { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
  { id: "sapphire", label: "Sapphire", color: "bg-blue-500" },
  { id: "violet", label: "Violet", color: "bg-purple-500" },
  { id: "rose", label: "Rose", color: "bg-rose-500" },
];

const LANGUAGES = [
  { id: "en", label: "English", short: "EN" },
  { id: "hi", label: "हिंदी", short: "HI" },
];

export function AppHeader({ user }: { user?: any }) {
  const { language, setLanguage, t } = useTranslation();
  const crumbs = useBreadcrumbs();
  const [isDark, setIsDark] = useState(false);
  const [activeTheme, setActiveTheme] = useState("emerald");
  const unreadCount = 4;

  useEffect(() => {
    // Check initial dark mode
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
    // Check initial theme
    const savedTheme = localStorage.getItem("app-theme") || "emerald";
    setActiveTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const changeColorTheme = (themeId: string) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("app-theme", themeId);
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

      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-primary transition-colors" />
      <Separator orientation="vertical" className="h-5 bg-border/60" />

      {/* Mobile page title (visible only below sm breakpoint) */}
      {crumbs.length > 0 && (
        <span className="sm:hidden text-sm font-semibold text-foreground truncate max-w-[160px]">
          {t(crumbs[crumbs.length - 1].label)}
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
              {t(crumb.label)}
            </span>
          </span>
        ))}
        {/* Accent dot for current page */}
        {crumbs.length > 0 && (
          <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        )}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground
                     hover:bg-primary/10 transition-all duration-200"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary
                           hover:bg-primary/10 transition-all duration-200 relative"
              >
                <Globe className="h-4 w-4" />
                <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-primary text-primary-foreground rounded px-0.5">
                  {LANGUAGES.find((l) => l.id === language)?.short}
                </span>
                <span className="sr-only">Language Option</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-36 rounded-xl border-border/60 shadow-xl shadow-black/10 p-1.5">
            <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 text-muted-foreground">
              {language === "hi" ? "भाषा चुनें" : "Select Language"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1 bg-border/60" />
            {LANGUAGES.map((l) => (
              <DropdownMenuItem
                key={l.id}
                onClick={() => setLanguage(l.id as any)}
                className={cn(
                  "rounded-lg cursor-pointer text-sm gap-2.5 px-2 py-1.5 transition-colors",
                  language === l.id && "bg-primary/10 font-semibold text-primary"
                )}
              >
                {l.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Color Theme Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary
                           hover:bg-primary/10 transition-all duration-200"
              >
                <Palette className="h-4 w-4" />
                <span className="sr-only">Color Theme</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40 rounded-xl border-border/60 shadow-xl shadow-black/10 p-1.5">
            <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 text-muted-foreground">
              Color Theme
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1 bg-border/60" />
            {THEMES.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => changeColorTheme(t.id)}
                className={cn(
                  "rounded-lg cursor-pointer text-sm gap-2.5 px-2 py-1.5 transition-colors",
                  activeTheme === t.id && "bg-primary/10 font-semibold text-primary"
                )}
              >
                <span className={cn("h-3 w-3 rounded-full shadow-sm ring-1 ring-border", t.color)} />
                {t.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary
                     hover:bg-primary/10 transition-all duration-200"
          onClick={toggleTheme}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400" />
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
                     hover:bg-primary/10 relative transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <>
              {/* Ping animation ring */}
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-60 animate-ping" />
              </span>
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full px-1
                                text-[10px] font-bold
                                bg-gradient-to-br from-destructive to-destructive/80
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
                className="h-8 gap-2 px-2 rounded-lg hover:bg-primary/10 transition-all duration-200"
              />
            }
          >
            <Avatar className="h-6 w-6 ring-2 ring-primary/40 ring-offset-1 ring-offset-background transition-all duration-200">
              <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-semibold text-foreground">
              {user?.name || (language === "hi" ? "उपयोगकर्ता" : "User")}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl border-border/60 shadow-xl shadow-black/10 p-1.5">
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 ring-2 ring-primary/40">
                  <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">{user?.name || (language === "hi" ? "उपयोगकर्ता" : "User")}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-primary" />
                    {user?.role || (language === "hi" ? "उम्मीदवार" : "Candidate")}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1 bg-border/60" />
            <DropdownMenuItem className="rounded-lg cursor-pointer text-sm gap-2.5 px-3 py-2 hover:bg-primary/10 hover:text-primary">
              <User className="h-4 w-4 text-muted-foreground" />
              {language === "hi" ? "प्रोफ़ाइल" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer text-sm gap-2.5 px-3 py-2 hover:bg-primary/10 hover:text-primary">
              <Settings className="h-4 w-4 text-muted-foreground" />
              {t("Settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-1 bg-border/60" />
            <DropdownMenuItem 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg cursor-pointer text-sm gap-2.5 px-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/8"
            >
              <LogOut className="h-4 w-4" />
              {t("Log out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
