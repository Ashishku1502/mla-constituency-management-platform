"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/partner/dashboard");
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in duration-500 pb-10 pt-16">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Partner Portal</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Sign in to manage your constituency territory.</p>
      </div>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Partner ID or Email</label>
              <Input required placeholder="PRT-12345 or email@example.com" className="h-12 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <Link href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</Link>
              </div>
              <Input required type="password" placeholder="••••••••" className="h-12 bg-slate-50 dark:bg-slate-950" />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-md mt-4">
              {loading ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In <LogIn className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Don't have a partner account?{" "}
              <Link href="/partner/signup" className="text-indigo-600 font-semibold hover:underline">
                Apply Now
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
