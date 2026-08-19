"use client";

import { useEffect } from "react";
import { AlertCircle, Database } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  const isDatabaseError =
    error.message?.includes("database") ||
    error.message?.includes("prisma") ||
    error.message?.includes("connect") ||
    error.message?.includes("Minified React error") || // React hydration / suspense error often triggered by db connection
    error.digest != null; // Often server-side database errors pass a digest to the client

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        {isDatabaseError ? (
          <Database className="w-12 h-12 text-destructive" />
        ) : (
          <AlertCircle className="w-12 h-12 text-destructive" />
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-2">
        {isDatabaseError ? "Database Connection Required" : "Something went wrong"}
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-8">
        {isDatabaseError 
          ? "This page requires a connection to your PostgreSQL database. If you are viewing this on Vercel, please link a database and ensure the DATABASE_URL environment variable is set."
          : "An unexpected error occurred while loading this page. Please try again."}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/dashboard"
          className="px-6 py-2 border border-input bg-background rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
