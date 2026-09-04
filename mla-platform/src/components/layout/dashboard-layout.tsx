"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-translation";

export function DashboardLayout({ children, user }: { children: React.ReactNode, user?: any }) {
  return (
    <LanguageProvider>
      <TooltipProvider delay={0}>
        <SidebarProvider>
          <AppSidebar user={user} />
          <SidebarInset>
            <AppHeader user={user} />
            <main className="flex-1 overflow-auto">
              <div className="p-3 sm:p-4 md:p-6">{children}</div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </LanguageProvider>
  );
}
