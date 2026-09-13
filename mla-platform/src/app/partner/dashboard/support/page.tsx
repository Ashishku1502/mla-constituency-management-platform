"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Book, Search, Plus, LifeBuoy } from "lucide-react";

export default function PartnerSupportPage() {
  const tickets = [
    { id: "TKT-1042", subject: "Commission calculation error for Sector 4", status: "Open", priority: "High", date: "2 hours ago" },
    { id: "TKT-1041", subject: "App crashing when adding a new lead", status: "In Progress", priority: "High", date: "Yesterday" },
    { id: "TKT-1035", subject: "How to update territory boundaries?", status: "Resolved", priority: "Low", date: "Oct 05, 2026" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Help & Support</h1>
          <p className="text-slate-500 dark:text-slate-400">Get assistance with your partner account or technical issues.</p>
        </div>
        <Button className="h-10 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors cursor-pointer group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 mx-auto group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Live Chat</h3>
              <p className="text-sm text-slate-500 mt-1">Chat with our support team instantly.</p>
            </div>
            <Button variant="outline" className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 mx-auto group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Phone Support</h3>
              <p className="text-sm text-slate-500 mt-1">Call your dedicated account manager.</p>
            </div>
            <Button variant="outline" className="w-full">View Number</Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 hover:border-green-500 transition-colors cursor-pointer group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 mx-auto group-hover:scale-110 transition-transform">
              <Book className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Knowledge Base</h3>
              <p className="text-sm text-slate-500 mt-1">Browse FAQs and guides.</p>
            </div>
            <Button variant="outline" className="w-full">Browse Articles</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-slate-500" />
            <CardTitle className="text-lg">Recent Tickets</CardTitle>
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-9 h-10 bg-white dark:bg-slate-950" placeholder="Search tickets..." />
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket ID</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-indigo-600 hover:underline">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={
                      ticket.status === 'Open' ? 'bg-red-50 text-red-700 border-red-200' : 
                      ticket.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                      'bg-green-50 text-green-700 border-green-200'
                    }>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {ticket.priority}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {ticket.date}
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
