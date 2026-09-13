"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, ShieldCheck, CheckCircle2, FileText, ArrowRight, XCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function PartnerDashboardDepositPage() {
  const [paymentState, setPaymentState] = useState<"pending" | "processing" | "success" | "failed">("pending");

  const handlePayment = () => {
    setPaymentState("processing");
    setTimeout(() => {
      if (Math.random() > 0.1) setPaymentState("success");
      else setPaymentState("failed");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Deposit Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage security deposits for expanding your territory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

            {paymentState === "pending" && (
              <>
                <CardHeader className="text-center pt-10">
                  <div className="mx-auto bg-indigo-50 dark:bg-indigo-900/20 w-20 h-20 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                    <IndianRupee className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-3xl font-bold">₹25,000</CardTitle>
                  <CardDescription className="text-base mt-2">Required deposit to unlock Zone Gamma assignment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                      <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" /> Secure Payment Gateway
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your payment is processed securely. Security deposits are refundable upon territory release.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pb-10 pt-4 flex-col gap-4">
                  <Button size="lg" className="w-full sm:max-w-xs h-12 text-md bg-indigo-600 hover:bg-indigo-700" onClick={handlePayment}>
                    Pay Deposit Now
                  </Button>
                </CardFooter>
              </>
            )}

            {paymentState === "processing" && (
              <CardContent className="py-20 text-center space-y-6">
                <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">Processing Payment...</h3>
                <p className="text-slate-500">Please do not refresh this page.</p>
              </CardContent>
            )}

            {paymentState === "success" && (
              <CardContent className="py-16 text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Payment Successful!</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Your deposit has been received. Zone Gamma has been unlocked in your territory map.
                </p>
                <div className="pt-8 flex justify-center">
                  <Button variant="outline" className="h-12 px-6" onClick={() => setPaymentState("pending")}>
                    Make Another Deposit
                  </Button>
                </div>
              </CardContent>
            )}

            {paymentState === "failed" && (
              <CardContent className="py-16 text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-6">
                  <XCircle className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Payment Failed</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                  We couldn't process your payment. Please try again.
                </p>
                <div className="pt-8 flex justify-center">
                  <Button variant="outline" className="h-12 px-8" onClick={() => setPaymentState("pending")}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Deposit History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <p className="font-semibold text-sm">Zone Alpha Deposit</p>
                  <p className="text-xs text-slate-500">Oct 01, 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₹25,000</p>
                  <span className="text-xs text-green-600 flex items-center justify-end mt-1"><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</span>
                </div>
              </div>
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <p className="font-semibold text-sm">Zone Beta Deposit</p>
                  <p className="text-xs text-slate-500">Sep 15, 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₹25,000</p>
                  <span className="text-xs text-green-600 flex items-center justify-end mt-1"><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
