"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Camera } from "lucide-react";

export default function PartnerProfilePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information and partner settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Sidebar */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm col-span-1 h-fit">
          <CardContent className="p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-950 shadow-lg overflow-hidden flex items-center justify-center">
                <User className="w-12 h-12 text-slate-400" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-indigo-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">John Doe</h2>
            <p className="text-slate-500 text-sm mb-4">Senior Partner</p>
            
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none mb-6">
              <ShieldCheck className="w-3 h-3 mr-1" /> Verified Partner
            </Badge>

            <div className="space-y-3 text-left border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
                john.doe@example.com
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-slate-400" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400" />
                Mumbai, Maharashtra
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Building className="w-4 h-4 text-slate-400" />
                PRT-12345
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm col-span-1 lg:col-span-2">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Update your personal information and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                <Input defaultValue="John" className="bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                <Input defaultValue="Doe" className="bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <Input defaultValue="john.doe@example.com" type="email" className="bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                <Input defaultValue="+91 98765 43210" type="tel" className="bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street Address</label>
              <Input defaultValue="123 Main St, Apartment 4B" className="bg-slate-50 dark:bg-slate-950" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                <Input defaultValue="Mumbai" className="bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">State</label>
                <Input defaultValue="Maharashtra" className="bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pincode</label>
                <Input defaultValue="400001" className="bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
