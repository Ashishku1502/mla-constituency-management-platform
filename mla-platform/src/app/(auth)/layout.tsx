"use client";

import { Landmark } from "lucide-react";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50/50 via-background to-blue-50/50 dark:from-indigo-950/10 dark:via-background dark:to-blue-950/10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{APP_NAME}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {APP_DESCRIPTION}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
