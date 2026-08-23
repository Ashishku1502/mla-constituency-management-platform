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
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-white/10 bg-[#0f172a] shadow-2xl">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[120%] h-[50%] bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-[40%] -right-[30%] w-[100%] h-[60%] bg-gradient-to-tl from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <SidebarHeader className="relative z-10 px-4 py-5 border-b border-white/5 bg-black/10 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center gap-3 group relative z-10">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                          bg-gradient-to-br from-indigo-500 to-cyan-400
                          shadow-[0_0_15px_rgba(99,102,241,0.5)]
                          transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]">
            <Landmark className="h-5 w-5 text-white drop-shadow-md" />
            <span className="absolute inset-0 rounded-xl ring-1 ring-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-base font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 drop-shadow-sm">
              {APP_NAME}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase
                             text-cyan-400 leading-none mt-1 opacity-90">
              Constituency Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6 z-10 space-y-1 custom-scrollbar">
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
                              "relative font-medium transition-all duration-300 rounded-xl overflow-hidden group/btn",
                              "hover:bg-white/5 hover:text-white",
                              (isActive || isChildActive)
                                ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/5 text-white font-semibold ring-1 ring-white/10 shadow-inner"
                                : "text-slate-300"
                            )}
                          />
                        }
                      >
                        {/* Hover glow effect behind icon */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 -translate-x-full group-hover/btn:translate-x-0" />
                        
                        <item.icon
                          className={cn(
                            "h-4.5 w-4.5 transition-all duration-300 relative z-10",
                            (isActive || isChildActive)
                              ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                              : "text-slate-400 group-hover/btn:text-white"
                          )}
                        />
                        <span className="relative z-10 tracking-wide">{item.title}</span>
                        <ChevronRight className={cn(
                          "ml-auto h-4 w-4 transition-transform duration-300 relative z-10",
                          isChildActive ? "text-cyan-400 rotate-90" : "text-slate-500 group-hover/btn:text-white group-data-[state=open]/collapsible:rotate-90"
                        )} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        <SidebarMenuSub className="pl-5 border-l-2 border-white/5 ml-3 mt-1.5 mb-1.5 gap-1">
                          {item.children!.map((child) => {
                            const isSubActive =
                              pathname === child.href ||
                              pathname.startsWith(child.href + "/");
                            return (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  isActive={isSubActive}
                                  className={cn(
                                    "transition-all duration-300 rounded-lg text-[13px] tracking-wide relative group/sub",
                                    "hover:text-white hover:bg-white/5 hover:translate-x-1",
                                    isSubActive
                                      ? "text-white font-semibold bg-white/5 ring-1 ring-white/5"
                                      : "text-slate-400"
                                  )}
                                  render={<Link href={child.href} />}
                                >
                                  {isSubActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
                                  <child.icon className={cn("h-3.5 w-3.5 transition-colors duration-300", isSubActive ? "text-cyan-400" : "text-slate-500 group-hover/sub:text-slate-300")} />
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
                        "relative font-medium transition-all duration-300 rounded-xl overflow-hidden group/btn",
                        "hover:bg-white/5 hover:text-white hover:translate-x-1",
                        isActive
                          ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/5 text-white font-semibold ring-1 ring-white/10 shadow-inner"
                          : "text-slate-300"
                      )}
                      render={<Link href={item.href} />}
                    >
                      <item.icon
                        className={cn(
                          "h-4.5 w-4.5 transition-all duration-300 relative z-10",
                          isActive
                            ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                            : "text-slate-400 group-hover/btn:text-white"
                        )}
                      />
                      <span className="relative z-10 tracking-wide">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="relative z-10 px-4 py-4 bg-black/20 backdrop-blur-xl border-t border-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto py-2.5 px-2 hover:bg-white/10 rounded-xl transition-all duration-300 group/footer border border-transparent hover:border-white/5">
              <Avatar className="h-9 w-9 ring-2 ring-indigo-500/30 group-hover/footer:ring-cyan-400 transition-all shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-cyan-500 text-white font-bold tracking-wider">
                  AS
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden ml-1">
                <span className="text-sm font-bold text-white tracking-wide">Amarinder S.</span>
                <span className="text-[10px] text-cyan-300 font-medium tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
                  Candidate
                </span>
              </div>
              <LogOut className="ml-auto h-4.5 w-4.5 text-slate-400 group-hover/footer:text-rose-400 transition-colors group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
