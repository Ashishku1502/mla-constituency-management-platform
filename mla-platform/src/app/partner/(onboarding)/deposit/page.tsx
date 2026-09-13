"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, ShieldCheck, CheckCircle2, FileText, ArrowRight, XCircle } from "lucide-react";
import Link from "next/link";

export default function PartnerDepositPage() {
  const [paymentState, setPaymentState] = useState<"pending" | "processing" | "success" | "failed">("pending");

  const handlePayment = () => {
    setPaymentState("processing");
    setTimeout(() => {
      // Mocking 90% success rate
      if (Math.random() > 0.1) setPaymentState("success");
      else setPaymentState("failed");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10 pt-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Security Deposit</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Secure your territory with a one-time refundable deposit.</p>
      </div>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800 shadow-xl overflow-hidden relative">
        
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

        {paymentState === "pending" && (
          <>
            <CardHeader className="text-center pt-10">
              <div className="mx-auto bg-indigo-50 dark:bg-indigo-900/20 w-20 h-20 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                <IndianRupee className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-bold">₹25,000</CardTitle>
              <CardDescription className="text-base mt-2">Fully refundable security deposit for Partner onboarding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" /> Secure Payment Gateway
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your payment is processed securely via our banking partners. No credit card information is stored on our servers.
                </p>
              </div>
            </CardContent>
            <CardFooter className="pb-10 pt-4 flex-col gap-4">
              <Button size="lg" className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700" onClick={handlePayment}>
                Pay Now
              </Button>
              <p className="text-xs text-slate-400 text-center">By clicking pay, you accept our payment terms and conditions.</p>
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
              Your security deposit of ₹25,000 has been received successfully. Transaction ID: #TXN-987654321
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="h-12 px-6">
                <FileText className="w-4 h-4 mr-2" /> View Receipt
              </Button>
              <Link href="/partner/activation">
                <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                  Continue to Activation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
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
              We couldn't process your payment. Please ensure your card details are correct or try a different payment method.
            </p>
            
            <div className="pt-8 flex gap-4 justify-center">
              <Button variant="outline" className="h-12 px-8" onClick={() => setPaymentState("pending")}>
                Try Again
              </Button>
            </div>
          </CardContent>
        )}

      </Card>
    </div>
  );
}
