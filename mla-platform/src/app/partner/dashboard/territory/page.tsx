"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, MapPin, Users, Crosshair, Plus, ShieldAlert } from "lucide-react";

export default function PartnerTerritoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Territory</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and analyze your assigned regions via the interactive map.</p>
        </div>
        <Button className="h-10 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Request New Territory
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Section */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-lg">Constituency Map</CardTitle>
              <CardDescription>Live view of your active zones</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8">Satellite</Button>
              <Button size="sm" className="h-8 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Terrain</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative min-h-[500px] bg-slate-100 dark:bg-slate-800">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* Interactive Map UI Overlay Elements */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg shadow-lg p-3 space-y-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div> High Density
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Medium Density
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div> Low Density
                </div>
              </div>
            </div>

            {/* Map Markers (Mocked) */}
            <div className="absolute top-1/3 left-1/3 group cursor-pointer">
              <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-bounce"></div>
              <div className="absolute top-8 -left-12 bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 w-32 hidden group-hover:block z-10 border border-slate-100 dark:border-slate-700">
                <p className="font-bold text-sm">Zone Alpha</p>
                <p className="text-xs text-slate-500">1.2k Leads</p>
              </div>
            </div>

            <div className="absolute top-1/2 left-2/3 group cursor-pointer">
              <div className="w-6 h-6 bg-yellow-500 rounded-full border-4 border-white shadow-lg"></div>
              <div className="absolute top-8 -left-12 bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 w-32 hidden group-hover:block z-10 border border-slate-100 dark:border-slate-700">
                <p className="font-bold text-sm">Zone Beta</p>
                <p className="text-xs text-slate-500">850 Leads</p>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50">
                <Map className="w-12 h-12 text-indigo-500 mx-auto mb-2 opacity-50" />
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">Interactive Map Integration</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">Mapbox or Google Maps will be integrated here for full geospatial analysis.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Territory Details Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle>Territory Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Active Zones</p>
                    <p className="text-xs text-slate-500">Total assigned regions</p>
                  </div>
                </div>
                <span className="text-lg font-bold">14</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Total Population</p>
                    <p className="text-xs text-slate-500">Estimated voters</p>
                  </div>
                </div>
                <span className="text-lg font-bold">125k</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <Crosshair className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Coverage Rate</p>
                    <p className="text-xs text-slate-500">Door-to-door completion</p>
                  </div>
                </div>
                <span className="text-lg font-bold">42%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-600 text-white shadow-lg border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-white">Territory Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-100 text-sm mb-4">
                Zone Beta is showing 15% lower engagement than average. Consider reallocating ground team members to this area.
              </p>
              <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50">
                Deploy Ground Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
