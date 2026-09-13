"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, ArrowUpRight, ArrowDownRight, Wallet, Download, Clock } from "lucide-react";

export default function PartnerEarningsPage() {
  const transactions = [
    { id: "TXN-9021", date: "Oct 12, 2026", type: "Commission", description: "Campaign completion bonus - Sector 4", amount: "+₹5,000", status: "Completed" },
    { id: "TXN-9022", date: "Oct 10, 2026", type: "Payout", description: "Bank Transfer to HDFC Bank", amount: "-₹15,000", status: "Completed" },
    { id: "TXN-9023", date: "Oct 05, 2026", type: "Commission", description: "Lead conversion bonus (x50)", amount: "+₹12,500", status: "Completed" },
    { id: "TXN-9024", date: "Oct 01, 2026", type: "Commission", description: "Monthly base retainer", amount: "+₹10,000", status: "Completed" },
    { id: "TXN-9025", date: "Sep 28, 2026", type: "Payout", description: "Bank Transfer to HDFC Bank", amount: "-₹20,000", status: "Processing" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Earnings & Payouts</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your commissions, bonuses, and withdraw funds.</p>
        </div>
        <Button className="h-10 bg-indigo-600 hover:bg-indigo-700">
          <Wallet className="w-4 h-4 mr-2" /> Request Payout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <IndianRupee className="w-24 h-24" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-indigo-100 font-medium mb-1">Available Balance</p>
            <h3 className="text-4xl font-bold">₹32,500</h3>
            <p className="text-xs text-indigo-200 mt-4">Last updated: Today, 09:41 AM</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Earned (YTD)</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white ml-14">₹1,24,000</h3>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Withdrawn</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white ml-14">₹91,500</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="w-4 h-4 mr-2" /> Statement
          </Button>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction Details</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{txn.description}</p>
                    <p className="text-xs text-slate-500">{txn.id}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {txn.date}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {txn.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${txn.amount.startsWith('+') ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
                      {txn.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={
                      txn.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }>
                      {txn.status === 'Processing' && <Clock className="w-3 h-3 mr-1" />}
                      {txn.status}
                    </Badge>
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
