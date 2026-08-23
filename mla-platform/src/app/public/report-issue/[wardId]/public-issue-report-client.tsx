"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Camera, CheckCircle2, ShieldAlert } from "lucide-react";

export function PublicIssueReportClient({ wardId, wardName }: { wardId: string, wardName: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-lg text-center p-6">
          <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Issue Reported!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for bringing this to our attention. Our team in {wardName} has been notified and will look into it shortly.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline" className="w-full">
            Report Another Issue
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-full mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Report a Local Issue</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <MapPin className="h-4 w-4" /> {wardName}
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-lg">Issue Details</CardTitle>
            <CardDescription>
              Please provide accurate information to help us resolve the problem faster.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="What kind of issue is this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roads">Roads & Potholes</SelectItem>
                    <SelectItem value="water">Water Supply</SelectItem>
                    <SelectItem value="electricity">Electricity & Streetlights</SelectItem>
                    <SelectItem value="sanitation">Sanitation & Garbage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the problem in detail..." 
                  className="resize-none min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Photo (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                  <Camera className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-sm">Tap to upload a photo</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name (Optional)</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="For updates on this issue" />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
