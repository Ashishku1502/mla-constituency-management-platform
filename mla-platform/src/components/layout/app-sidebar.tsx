"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, LogOut, Landmark, Sparkles } from "lucide-react";
import { NAVIGATION, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {/* Header — deep emerald gradient */}
      <SidebarHeader className="relative overflow-hidden px-4 py-4 border-b border-sidebar-border/40">
        {/* Decorative glow blob */}
        <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[oklch(0.78_0.16_80/0.15)] blur-2xl" />
        <Link href="/dashboard" className="flex items-center gap-3 group relative z-10">
          {/* Logo icon with gold glow */}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                          bg-gradient-to-br from-[oklch(0.78_0.16_80)] to-[oklch(0.72_0.18_55)]
                          shadow-lg shadow-[oklch(0.78_0.16_80/0.4)]
                          transition-all duration-300 group-hover:scale-110 group-hover:shadow-[oklch(0.78_0.16_80/0.6)]">
            <Landmark className="h-4.5 w-4.5 text-[oklch(0.14_0.08_75)]" />
            <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              {APP_NAME}
            </span>
            <span className="text-[10px] font-medium tracking-wider uppercase
                             text-[oklch(0.78_0.16_80)] leading-none mt-0.5">
              Constituency Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2.5 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAVIGATION.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const hasChildren = item.children && item.children.length > 0;
                const isChildActive = item.children?.some(
                  (child) =>
                    pathname === child.href ||
                    pathname.startsWith(child.href + "/")
                );

                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.href}
                      defaultOpen={isChildActive}
                      render={<SidebarMenuItem />}
                    >
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={cn(
                              "relative font-medium transition-all duration-200 rounded-lg",
                              "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                              (isActive || isChildActive) &&
                                "bg-gradient-to-r from-[oklch(0.78_0.16_80/0.18)] to-[oklch(0.78_0.16_80/0.08)] text-[oklch(0.78_0.16_80)] font-semibold sidebar-active-bar"
                            )}
                          />
                        }
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            (isActive || isChildActive)
                              ? "text-[oklch(0.78_0.16_80)]"
                              : "text-sidebar-foreground/60"
                          )}
                        />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-sidebar-foreground/40" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="pl-4 border-l border-[oklch(0.78_0.16_80/0.25)] ml-3 mt-1 gap-0.5">
                          {item.children!.map((child) => {
                            const isSubActive =
                              pathname === child.href ||
                              pathname.startsWith(child.href + "/");
                            return (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  isActive={isSubActive}
                                  className={cn(
                                    "transition-all duration-200 rounded-md text-xs",
                                    "hover:text-[oklch(0.78_0.16_80)] hover:bg-transparent",
                                    isSubActive &&
                                      "text-[oklch(0.78_0.16_80)] font-semibold"
                                  )}
                                  render={<Link href={child.href} />}
                                >
                                  <child.icon className={cn("h-3.5 w-3.5", isSubActive && "text-[oklch(0.78_0.16_80)]")} />
                                  <span>{child.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "relative font-medium transition-all duration-200 rounded-lg",
                        "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        isActive &&
                          "bg-gradient-to-r from-[oklch(0.78_0.16_80/0.18)] to-[oklch(0.78_0.16_80/0.08)] text-[oklch(0.78_0.16_80)] font-semibold sidebar-active-bar"
                      )}
                      render={<Link href={item.href} />}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive
                            ? "text-[oklch(0.78_0.16_80)]"
                            : "text-sidebar-foreground/60"
                        )}
                      />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border/40 px-3 py-3">
        {/* Decorative top shimmer line */}
        <div className="mb-2 h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.78_0.16_80/0.4)] to-transparent group-data-[collapsible=icon]:hidden" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto py-2 hover:bg-sidebar-accent/40 rounded-lg transition-all duration-200">
              <Avatar className="h-7 w-7 ring-2 ring-[oklch(0.78_0.16_80/0.6)] ring-offset-1 ring-offset-sidebar">
                <AvatarFallback className="text-xs bg-gradient-to-br from-[oklch(0.78_0.16_80)] to-[oklch(0.72_0.18_55)] text-[oklch(0.14_0.08_75)] font-bold">
                  AS
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">Amarinder S.</span>
                <span className="text-[10px] text-[oklch(0.78_0.16_80)] font-medium leading-none flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  Candidate
                </span>
              </div>
              <LogOut className="ml-auto h-4 w-4 text-sidebar-foreground/40 hover:text-[oklch(0.78_0.16_80)] transition-colors group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
