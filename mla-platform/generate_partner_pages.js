const fs = require('fs');
const path = require('path');

const routes = [
  { path: 'src/app/partner/(onboarding)/signup', name: 'PartnerSignUpPage', title: 'Partner Sign Up' },
  { path: 'src/app/partner/(onboarding)/deposit', name: 'PartnerDepositPage', title: 'Security Deposit' },
  { path: 'src/app/partner/(onboarding)/activation', name: 'PartnerActivationPage', title: 'Account Activation' },
  { path: 'src/app/partner/(onboarding)/login', name: 'PartnerLoginPage', title: 'Partner Login' },
  
  { path: 'src/app/partner/dashboard', name: 'PartnerDashboardOverviewPage', title: 'Dashboard Overview' },
  { path: 'src/app/partner/dashboard/profile', name: 'PartnerProfilePage', title: 'My Profile' },
  { path: 'src/app/partner/dashboard/territory', name: 'PartnerTerritoryPage', title: 'My Territory & Map' },
  { path: 'src/app/partner/dashboard/seats', name: 'PartnerSeatsPage', title: 'Seat Management' },
  { path: 'src/app/partner/dashboard/leads', name: 'PartnerLeadsPage', title: 'Leads' },
  { path: 'src/app/partner/dashboard/candidates', name: 'PartnerCandidatesPage', title: 'Candidates' },
  { path: 'src/app/partner/dashboard/campaigns', name: 'PartnerCampaignsPage', title: 'Campaigns' },
  { path: 'src/app/partner/dashboard/ground-team', name: 'PartnerGroundTeamPage', title: 'Ground Team' },
  { path: 'src/app/partner/dashboard/tasks', name: 'PartnerTasksPage', title: 'Tasks & Follow-ups' },
  { path: 'src/app/partner/dashboard/analytics', name: 'PartnerAnalyticsPage', title: 'Analytics' },
  { path: 'src/app/partner/dashboard/earnings', name: 'PartnerEarningsPage', title: 'Earnings' },
  { path: 'src/app/partner/dashboard/deposit', name: 'PartnerDashboardDepositPage', title: 'Deposit Management' },
  { path: 'src/app/partner/dashboard/notifications', name: 'PartnerNotificationsPage', title: 'Notifications' },
  { path: 'src/app/partner/dashboard/support', name: 'PartnerSupportPage', title: 'Support' },
  { path: 'src/app/partner/dashboard/settings', name: 'PartnerSettingsPage', title: 'Settings' },
];

const template = (name, title) => `"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function ${name}() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">${title}</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage ${title.toLowerCase()} details.</p>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <CardTitle>${title} Module</CardTitle>
          <CardDescription>This module is currently under active development.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
            <p className="text-slate-500 font-medium">Content coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;

routes.forEach(route => {
  const dirPath = path.join(__dirname, route.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, 'page.tsx');
  fs.writeFileSync(filePath, template(route.name, route.title));
});
