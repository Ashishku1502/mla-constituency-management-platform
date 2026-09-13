"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PartnerActivationPage() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Auto-focus next input would go here in a real implementation
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10 pt-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Account Activation</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Verify your identity and activate your partner portal.</p>
      </div>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

        <CardContent className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                  <KeyRound className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Partner ID</label>
                <Input placeholder="e.g. PRT-98237" className="h-12 bg-slate-50 dark:bg-slate-950 text-center text-lg tracking-widest font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number or Email</label>
                <Input placeholder="+91 98765 43210" className="h-12 bg-slate-50 dark:bg-slate-950" />
              </div>
              
              <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-md mt-4" onClick={() => setStep(2)}>
                Send OTP
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Smartphone className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Enter Verification Code</h3>
              <p className="text-sm text-slate-500">We've sent a 6-digit code to your registered mobile number.</p>
              
              <div className="flex justify-center gap-2 my-8">
                {otp.map((digit, i) => (
                  <Input 
                    key={i} 
                    type="text" 
                    maxLength={1} 
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 dark:bg-slate-950" 
                  />
                ))}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Set New Password</label>
                <Input type="password" placeholder="••••••••" className="h-12 bg-slate-50 dark:bg-slate-950" />
              </div>

              <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-md mt-4" onClick={() => setStep(3)}>
                Verify & Activate
              </Button>
              <button className="text-sm text-indigo-600 font-medium hover:underline mt-4 inline-block">Resend Code</button>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Account Activated!</h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                Your partner account is now fully active. You can log in to your dashboard to manage your territory.
              </p>
              
              <div className="pt-8 flex justify-center">
                <Link href="/partner/login" className="w-full">
                  <Button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 w-full text-md">
                    Go to Login <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
