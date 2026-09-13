"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, CheckCircle2, User, Briefcase, Mail, Phone, BookOpen, Link as LinkIcon, Award, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  designation: z.string().min(2, "Designation is required"),
  politicalInfo: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  biography: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  publicProfile: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      designation: "",
      politicalInfo: "",
      email: "",
      phone: "",
      biography: "",
      education: "",
      experience: "",
      publicProfile: "",
    },
  });

  const onSubmit = async (data: PersonalInfoFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/candidate/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Personal information updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl border-border/20 bg-gradient-to-b from-card/80 to-card backdrop-blur-xl">
      <CardHeader className="pb-8 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <UserCircle className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Personal Information
            </CardTitle>
            <CardDescription className="text-base mt-1.5">
              Manage your public persona, contact details, and professional background.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8 px-6 md:px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* Photograph Section */}
          <section 
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300",
              activeSection === 'photo' ? "border-primary/50 shadow-md bg-primary/5" : "border-border/40 hover:border-border"
            )}
            onFocus={() => setActiveSection('photo')}
            onClick={() => setActiveSection('photo')}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" /> Profile Picture
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-background flex items-center justify-center bg-muted/80 transition-transform duration-300 group-hover:scale-[1.02]">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <User className="h-10 w-10 mb-2 opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <UploadCloud className="w-8 h-8 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
              <div className="text-center sm:text-left space-y-2">
                <p className="text-base font-medium text-foreground">Upload your best photo</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  A high-quality, professional headshot is recommended. JPG, PNG or GIF up to 5MB.
                </p>
                <Button type="button" variant="outline" size="sm" className="mt-2 relative overflow-hidden group">
                  <span className="relative z-10">Select Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    onChange={handlePhotoUpload}
                  />
                </Button>
              </div>
            </div>
          </section>

          {/* Basic Info Section */}
          <section 
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300",
              activeSection === 'basic' ? "border-primary/50 shadow-md bg-primary/5" : "border-border/40 hover:border-border"
            )}
            onFocus={() => setActiveSection('basic')}
            onClick={() => setActiveSection('basic')}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" /> Core Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-medium">Candidate Name <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="name" placeholder="e.g. Jane Doe" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("name")} />
                </div>
                {errors.name && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="designation" className="text-sm font-medium">Designation <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="designation" placeholder="e.g. Member of Legislative Assembly" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("designation")} />
                </div>
                {errors.designation && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.designation.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-medium">Email Address <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="e.g. jane@example.com" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("email")} />
                </div>
                {errors.email && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="e.g. +91 9876543210" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("phone")} />
                </div>
                {errors.phone && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.phone.message}</p>}
              </div>
            </div>
          </section>

          {/* Detailed Profile Section */}
          <section 
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300",
              activeSection === 'detailed' ? "border-primary/50 shadow-md bg-primary/5" : "border-border/40 hover:border-border"
            )}
            onFocus={() => setActiveSection('detailed')}
            onClick={() => setActiveSection('detailed')}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Biography & Background
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="biography" className="text-sm font-medium">Full Biography</Label>
                <Textarea 
                  id="biography" 
                  placeholder="Provide a comprehensive overview of your life, career, and values..." 
                  className="min-h-[140px] resize-y transition-all focus-visible:ring-primary/50"
                  {...register("biography")} 
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="politicalInfo" className="text-sm font-medium">Political & Organisation Information</Label>
                <Textarea 
                  id="politicalInfo" 
                  placeholder="Details about party affiliation, current roles, committees, etc." 
                  className="min-h-[100px] resize-y transition-all focus-visible:ring-primary/50"
                  {...register("politicalInfo")} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="education" className="text-sm font-medium">Educational Qualifications</Label>
                  <Textarea 
                    id="education" 
                    placeholder="Degrees, institutions attended, notable academic achievements..." 
                    className="min-h-[120px] resize-y transition-all focus-visible:ring-primary/50"
                    {...register("education")} 
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="experience" className="text-sm font-medium">Professional Experience</Label>
                  <Textarea 
                    id="experience" 
                    placeholder="Previous political offices, professional roles, community leadership..." 
                    className="min-h-[120px] resize-y transition-all focus-visible:ring-primary/50"
                    {...register("experience")} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Web Links Section */}
          <section 
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300",
              activeSection === 'links' ? "border-primary/50 shadow-md bg-primary/5" : "border-border/40 hover:border-border"
            )}
            onFocus={() => setActiveSection('links')}
            onClick={() => setActiveSection('links')}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" /> Web Presence
            </h3>
            <div className="space-y-2.5 max-w-2xl">
              <Label htmlFor="publicProfile" className="text-sm font-medium">Official Website or Profile Link</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="publicProfile" 
                  type="url" 
                  placeholder="https://your-official-site.com" 
                  className="pl-10 transition-all focus-visible:ring-primary/50"
                  {...register("publicProfile")} 
                />
              </div>
              {errors.publicProfile && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.publicProfile.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">This link will be prominently displayed on your public page.</p>
            </div>
          </section>
          
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/40 sticky bottom-0 bg-card/95 backdrop-blur py-4 z-10 rounded-b-xl -mx-6 px-6 md:-mx-10 md:px-10">
            {isDirty && (
              <span className="text-sm text-muted-foreground animate-pulse mr-auto hidden sm:inline-block">
                You have unsaved changes
              </span>
            )}
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => reset()}
              className="hover:bg-muted/50"
            >
              Reset Changes
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className={cn(
                "min-w-[140px] shadow-lg transition-all duration-300",
                isSubmitting ? "opacity-80" : "hover:-translate-y-0.5 hover:shadow-primary/25"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
