"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, UserPlus, Phone, Mail, MoreHorizontal, ArrowUpRight } from "lucide-react";

export default function PartnerLeadsPage() {
  const leads = [
    { id: "L-1045", name: "Vikram Singh", phone: "+91 98765 12345", area: "Sector 4", status: "New", intent: "High", added: "2 hours ago" },
    { id: "L-1046", name: "Pooja Verma", phone: "+91 98765 54321", area: "Colony A", status: "Contacted", intent: "Medium", added: "5 hours ago" },
    { id: "L-1047", name: "Rahul Deshmukh", phone: "+91 98765 98765", area: "Sector 9", status: "Converted", intent: "High", added: "1 day ago" },
    { id: "L-1048", name: "Anita Rao", phone: "+91 98765 11111", area: "Colony B", status: "Lost", intent: "Low", added: "2 days ago" },
    { id: "L-1049", name: "Sanjay Gupta", phone: "+91 98765 22222", area: "Sector 4", status: "New", intent: "Medium", added: "2 days ago" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Leads Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and convert potential voters in your area.</p>
        </div>
        <Button className="h-10 bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="w-4 h-4 mr-2" /> Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 font-medium">Total Leads</p>
            <h3 className="text-2xl font-bold mt-1">1,245</h3>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 font-medium">New Today</p>
            <h3 className="text-2xl font-bold mt-1">42</h3>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 font-medium">Converted</p>
            <h3 className="text-2xl font-bold mt-1">850</h3>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 font-medium">High Intent</p>
            <h3 className="text-2xl font-bold mt-1">315</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9 h-10 bg-white dark:bg-slate-950" placeholder="Search by name, phone, or area..." />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-10">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <Button variant="outline" className="h-10">
              Export
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Lead Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Area</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Intent</th>
                <th className="px-6 py-4 font-medium">Added</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.id}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    {lead.phone}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {lead.area}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={
                      lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      lead.status === 'Converted' ? 'bg-green-50 text-green-700 border-green-200' : 
                      lead.status === 'Lost' ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        lead.intent === 'High' ? 'bg-green-500' :
                        lead.intent === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-slate-700 dark:text-slate-300">{lead.intent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{lead.added}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50">
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
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
