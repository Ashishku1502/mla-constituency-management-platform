"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Lock, Shield, User, Globe, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function PartnerSettingsPage() {
  const [theme, setTheme] = useState("system");

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your portal preferences and configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Settings Navigation Sidebar */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm col-span-1 h-fit">
          <CardContent className="p-2 space-y-1">
            <Button variant="ghost" className="w-full justify-start bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
              <User className="w-4 h-4 mr-2" /> General
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400">
              <Lock className="w-4 h-4 mr-2" /> Security
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400">
              <Shield className="w-4 h-4 mr-2" /> Data Privacy
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400">
              <Globe className="w-4 h-4 mr-2" /> Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Settings Content Area */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>Customize how the portal looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme Preference</label>
                  <p className="text-sm text-slate-500">Select your preferred color scheme.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors ${theme === 'dark' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                  >
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors ${theme === 'system' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    <Settings className="w-4 h-4 mr-2" /> System
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Control what alerts you receive and how.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Alerts</label>
                    <p className="text-sm text-slate-500">Receive daily summaries and critical alerts via email.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Push Notifications</label>
                    <p className="text-sm text-slate-500">Real-time alerts for lead conversions and tasks.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ground Team Updates</label>
                    <p className="text-sm text-slate-500">Get notified when team members complete zones.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm border-red-200 dark:border-red-900/50">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-lg text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions related to your partner account.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 max-w-md">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">Deactivate Partner Account</label>
                  <p className="text-sm text-slate-500">This will immediately suspend your access and halt all active campaigns in your territory.</p>
                </div>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                  Deactivate Account
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
