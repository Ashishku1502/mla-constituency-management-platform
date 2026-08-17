"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { ChevronRight, LogOut, Landmark } from "lucide-react";
import { NAVIGATION, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3.5">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Landmark className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight">
              {APP_NAME}
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Constituency Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
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
                              "font-medium transition-all duration-200 hover:bg-sidebar-accent/50",
                              (isActive || isChildActive) &&
                                "bg-sidebar-accent text-primary shadow-sm"
                            )}
                          />
                        }
                      >
                        <item.icon className={cn("h-4 w-4", (isActive || isChildActive) && "text-primary")} />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="pl-4 border-l border-sidebar-border/50 ml-2 mt-1">
                          {item.children!.map((child) => {
                            const isSubActive =
                              pathname === child.href ||
                              pathname.startsWith(child.href + "/");
                            return (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  isActive={isSubActive}
                                  className={cn("transition-all duration-200 hover:text-primary hover:bg-transparent", isSubActive && "text-primary font-medium")}
                                  render={<Link href={child.href} />}
                                >
                                  <child.icon className="h-3.5 w-3.5" />
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
                        "font-medium transition-all duration-200 hover:bg-sidebar-accent/50",
                        isActive && "bg-sidebar-accent text-primary shadow-sm"
                      )}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto py-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                  AS
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">Amarinder S.</span>
                <span className="text-[11px] text-muted-foreground leading-none">
                  Candidate
                </span>
              </div>
              <LogOut className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
