"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form data:", data);
    toast.success("Personal information updated successfully!");
    setIsSubmitting(false);
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
    <Card className="w-full max-w-4xl mx-auto shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Personal Information</CardTitle>
        <CardDescription>
          Update the candidate&apos;s personal details, contact information, and public profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Photograph Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Photograph</Label>
            <div className="flex items-center gap-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors">
                {photoPreview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePhotoUpload}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Upload a profile picture</p>
                <p>JPG, PNG or GIF. Max size 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="name">Candidate Name <span className="text-red-500">*</span></Label>
              <Input id="name" placeholder="e.g. Jane Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
              <Input id="designation" placeholder="e.g. Member of Legislative Assembly" {...register("designation")} />
              {errors.designation && <p className="text-xs text-red-500">{errors.designation.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input id="email" type="email" placeholder="e.g. jane@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
              <Input id="phone" type="tel" placeholder="e.g. +91 9876543210" {...register("phone")} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Detailed Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="politicalInfo">Political / Organisation Information</Label>
              <Textarea 
                id="politicalInfo" 
                placeholder="Details about party affiliation, current roles, etc." 
                className="min-h-[100px]"
                {...register("politicalInfo")} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea 
                id="biography" 
                placeholder="A brief overview of the candidate's life and career..." 
                className="min-h-[120px]"
                {...register("biography")} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea 
                  id="education" 
                  placeholder="Highest degree, university, year..." 
                  className="min-h-[100px]"
                  {...register("education")} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea 
                  id="experience" 
                  placeholder="Previous political or professional experience..." 
                  className="min-h-[100px]"
                  {...register("experience")} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicProfile">Public Profile Link</Label>
              <Input 
                id="publicProfile" 
                type="url" 
                placeholder="https://example.com/profile" 
                {...register("publicProfile")} 
              />
              {errors.publicProfile && <p className="text-xs text-red-500">{errors.publicProfile.message}</p>}
              <p className="text-xs text-muted-foreground">Link to official website or social media page.</p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="button" variant="outline" className="mr-4" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? "Saving..." : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Save Details
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
