"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Plus, Calendar, Filter } from "lucide-react";
import { useState } from "react";

export default function PartnerTasksPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  const tasks = [
    { id: 1, title: "Follow up with Ward 42 community leaders", date: "Today, 2:00 PM", status: "pending", priority: "High" },
    { id: 2, title: "Submit weekly territory report", date: "Today, 5:00 PM", status: "pending", priority: "Medium" },
    { id: 3, title: "Review ground team expenses for Oct", date: "Tomorrow, 10:00 AM", status: "pending", priority: "Medium" },
    { id: 4, title: "Distribute new campaign materials", date: "Oct 15, 2026", status: "pending", priority: "High" },
    { id: 5, title: "Call inactive volunteers in Zone Beta", date: "Yesterday", status: "completed", priority: "Low" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tasks & Follow-ups</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your daily checklist and upcoming appointments.</p>
        </div>
        <Button className="h-10 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> New Task
        </Button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button 
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          All Tasks
        </button>
        <button 
          onClick={() => setActiveTab("today")}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'today' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Today <span className="ml-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">2</span>
        </button>
        <button 
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'completed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Completed
        </button>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-2 border-b border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="w-4 h-4 mr-2" /> Calendar View
          </Button>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.filter(t => activeTab === 'all' || (activeTab === 'today' && t.date.includes('Today')) || (activeTab === 'completed' && t.status === 'completed')).map((task) => (
            <div key={task.id} className={`p-4 flex items-start gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${task.status === 'completed' ? 'opacity-60' : ''}`}>
              <button className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors">
                {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
              </button>
              <div className="flex-1">
                <p className={`font-medium text-slate-900 dark:text-white ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center text-xs text-slate-500">
                    <Clock className="w-3 h-3 mr-1" /> {task.date}
                  </span>
                  <Badge variant="outline" className={`${
                    task.priority === 'High' ? 'text-red-600 border-red-200 bg-red-50' : 
                    task.priority === 'Medium' ? 'text-orange-600 border-orange-200 bg-orange-50' : 
                    'text-slate-600 border-slate-200 bg-slate-50'
                  } ${task.status === 'completed' ? 'grayscale opacity-70' : ''}`}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
