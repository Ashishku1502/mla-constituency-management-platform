"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Star, Plus, MoreHorizontal, MessageSquare, Phone } from "lucide-react";

export default function PartnerCandidatesPage() {
  const candidates = [
    {
      id: "CAND-082",
      name: "Anil Deshmukh",
      party: "Independent",
      ward: "Ward 42",
      sentiment: "Positive",
      supportLevel: "Strong",
      lastContacted: "2 days ago",
    },
    {
      id: "CAND-083",
      name: "Suresh Kumar",
      party: "National Party",
      ward: "Ward 15",
      sentiment: "Neutral",
      supportLevel: "Moderate",
      lastContacted: "5 days ago",
    },
    {
      id: "CAND-084",
      name: "Meena Gupta",
      party: "Regional Front",
      ward: "Ward 07",
      sentiment: "Negative",
      supportLevel: "Weak",
      lastContacted: "1 week ago",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Candidates</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and manage potential candidates in your territory.</p>
        </div>
        <Button className="h-10 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Add Candidate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Candidates</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">24</h3>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <User className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Strong Support</p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">12</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Needs Follow-up</p>
                <h3 className="text-3xl font-bold text-orange-600 mt-1">5</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle>Candidate Directory</CardTitle>
            <CardDescription>Detailed list of profiled candidates.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Candidate Info</th>
                    <th className="px-6 py-4 font-medium">Ward</th>
                    <th className="px-6 py-4 font-medium">Sentiment</th>
                    <th className="px-6 py-4 font-medium">Support Level</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{candidate.name}</p>
                        <p className="text-xs text-slate-500">{candidate.party} • {candidate.id}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                        {candidate.ward}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          candidate.sentiment === 'Positive' ? 'bg-green-50 text-green-700 border-green-200' : 
                          candidate.sentiment === 'Neutral' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }>
                          {candidate.sentiment}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          {candidate.supportLevel === 'Strong' && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          {candidate.supportLevel === 'Moderate' && <Star className="w-4 h-4 text-yellow-500" />}
                          {candidate.supportLevel === 'Weak' && <Star className="w-4 h-4 text-slate-300" />}
                          <span className="ml-1 text-xs">{candidate.supportLevel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 text-indigo-600">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="text-lg text-indigo-900 dark:text-indigo-100 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Follow-ups Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm">Meena Gupta</p>
                  <span className="text-xs text-red-500 font-medium">Overdue</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Last contacted 1 week ago regarding regional policy updates.</p>
                <Button size="sm" className="w-full text-xs h-8 bg-indigo-600 hover:bg-indigo-700">Log Interaction</Button>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm">Suresh Kumar</p>
                  <span className="text-xs text-orange-500 font-medium">Today</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Scheduled call to discuss Ward 15 civic issues.</p>
                <Button size="sm" className="w-full text-xs h-8 bg-indigo-600 hover:bg-indigo-700">Log Interaction</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
