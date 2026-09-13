"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, UserPlus, MapPin, Activity, MoreVertical, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PartnerGroundTeamPage() {
  const teamMembers = [
    {
      id: "GT-104",
      name: "Ravi Shankar",
      role: "Team Lead",
      zone: "Zone Alpha",
      status: "Active",
      performance: "Excellent",
      tasksCompleted: 145,
    },
    {
      id: "GT-105",
      name: "Sunita Devi",
      role: "Volunteer",
      zone: "Zone Beta",
      status: "Active",
      performance: "Good",
      tasksCompleted: 89,
    },
    {
      id: "GT-106",
      name: "Karan Patel",
      role: "Field Agent",
      zone: "Zone Alpha",
      status: "Inactive",
      performance: "Needs Improvement",
      tasksCompleted: 24,
    },
    {
      id: "GT-107",
      name: "Priya Sharma",
      role: "Field Agent",
      zone: "Zone Gamma",
      status: "Active",
      performance: "Excellent",
      tasksCompleted: 210,
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ground Team</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your volunteers and field agents.</p>
        </div>
        <div className="flex gap-2">
          <Button className="h-10 bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Members</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">42</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Today</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">28</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Zones Covered</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Tasks/Day</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">15</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Team Roster</CardTitle>
              <CardDescription>Directory of all ground team personnel.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search members..." className="pl-9 h-10 w-full sm:w-64 bg-white dark:bg-slate-950" />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Member</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Zone</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Performance</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{member.role}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        {member.zone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-slate-700 dark:text-slate-300">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className={
                        member.performance === 'Excellent' ? 'bg-green-50 text-green-700 border-green-200' : 
                        member.performance === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-orange-50 text-orange-700 border-orange-200'
                      }>
                        {member.performance}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">{member.tasksCompleted} tasks done</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
