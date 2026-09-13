"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, MapPin, FileCheck, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PartnerSignUpPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10 pt-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Partner Sign Up</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Join the constituency management network today.</p>
      </div>

      <div className="flex items-center justify-between px-4 mb-8">
        {[
          { num: 1, title: "Personal Details", icon: User },
          { num: 2, title: "Address", icon: MapPin },
          { num: 3, title: "Verification", icon: FileCheck },
          { num: 4, title: "Confirmation", icon: ShieldCheck },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${step >= s.num ? "bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none" : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800 shadow-xl shadow-indigo-100/20 dark:shadow-none">
        <CardContent className="pt-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                  <Input placeholder="John" className="h-12 bg-slate-50 dark:bg-slate-950" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                  <Input placeholder="Doe" className="h-12 bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <Input type="email" placeholder="john.doe@example.com" className="h-12 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                <Input type="tel" placeholder="+91 98765 43210" className="h-12 bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street Address</label>
                <Input placeholder="123 Main St" className="h-12 bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                  <Input placeholder="Mumbai" className="h-12 bg-slate-50 dark:bg-slate-950" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">State</label>
                  <Input placeholder="Maharashtra" className="h-12 bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pincode</label>
                <Input placeholder="400001" className="h-12 bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                <FileCheck className="w-10 h-10 mx-auto text-slate-400 group-hover:text-indigo-500 mb-4 transition-colors" />
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">Upload Government ID</h3>
                <p className="text-sm text-slate-500 mt-1">Aadhar Card, PAN, or Voter ID (PDF or Image)</p>
                <Button variant="outline" className="mt-4">Select File</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">Terms & Confirmation</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                By proceeding, you agree to the Partner Terms of Service and Privacy Policy of the platform.
              </p>
            </div>
          )}
        </CardContent>
        <div className="px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : <div></div>}

          {step < 4 ? (
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8" onClick={() => setStep(step + 1)}>
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Link href="/partner/deposit">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                Confirm & Proceed to Deposit <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
