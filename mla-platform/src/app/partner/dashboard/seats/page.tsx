"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Users, ChevronRight, Armchair } from "lucide-react";

export default function PartnerSeatsPage() {
  const seats = [
    { id: "S-101", name: "Ward 42 (North)", status: "Assigned", lead: "Ravi Shankar", volunteers: 12 },
    { id: "S-102", name: "Ward 42 (South)", status: "Assigned", lead: "Anjali Desai", volunteers: 8 },
    { id: "S-103", name: "Sector 4 Main", status: "Open", lead: "-", volunteers: 0 },
    { id: "S-104", name: "Colony A", status: "Assigned", lead: "Amit Kumar", volunteers: 15 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Seat Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Allocate and monitor specific ground team assignments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-indigo-600 text-white shadow-lg border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Armchair className="w-24 h-24" />
          </div>
          <CardContent className="p-6 relative z-10 space-y-2">
            <p className="text-indigo-100 font-medium">Total Seats in Territory</p>
            <h3 className="text-4xl font-bold">14</h3>
            <p className="text-sm text-indigo-200 mt-2">11 Assigned • 3 Open</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle>Seat Directory</CardTitle>
          <CardDescription>Detailed view of all micro-regions within your active zones.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Seat Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Team Lead</th>
                <th className="px-6 py-4 font-medium">Volunteers</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {seats.map((seat) => (
                <tr key={seat.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{seat.name}</p>
                    <p className="text-xs text-slate-500">{seat.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={
                      seat.status === 'Assigned' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }>
                      {seat.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{seat.lead}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-600 dark:text-slate-300">
                      <Users className="w-4 h-4 mr-2 text-slate-400" />
                      {seat.volunteers}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm">
                      {seat.status === 'Open' ? 'Assign' : 'Manage'} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
