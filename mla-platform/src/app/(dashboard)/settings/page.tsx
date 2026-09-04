"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { Settings, User, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, platform settings, preferences, and notifications"
        icon={Settings}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Nav list */}
        <div className="md:col-span-1 space-y-2">
          <Card className="p-1">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-muted/50 text-foreground font-medium"><User className="h-4 w-4 text-primary" />Profile Settings</Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground"><Bell className="h-4 w-4" />Notifications</Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground"><Shield className="h-4 w-4" />Security & Sessions</Button>
          </Card>
        </div>

        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your contact and administrative profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" defaultValue="Rajesh Sharma" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" defaultValue="Official Candidate" disabled />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="candidate@constituencyos.org" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" defaultValue="+91 98765 43210" />
              </div>
            </div>

            <hr className="border-muted" />

            <h3 className="font-bold text-sm">System Preferences</h3>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold">Push Notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">Receive immediate operational notifications from field groups</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex justify-end pt-4">
              <Button size="sm" className="gap-1.5">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
