"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Users,
  Phone,
  User,
  Save,
  Loader2,
  Building2,
  Info,
  Edit3,
  X,
  Hash,
  Home,
} from "lucide-react";
import { toast } from "sonner";

interface VillageProfileData {
  id?: string;
  gramPanchayatNaam: string;
  village: string;
  block: string;
  district: string;
  state: string;
  pinCode: string;
  population: string;
  totalHouseholds: string;
  pradhanNaam: string;
  pradhanContact: string;
  status: string;
}

interface VillageProfileTabProps {
  initialProfile?: VillageProfileData | null;
}

const INITIAL_FORM: VillageProfileData = {
  gramPanchayatNaam: "pinna Gram Panchayat",
  village: "pinna",
  block: "baghra",
  district: "muzaffarnagar",
  state: "Uttar Pradesh",
  pinCode: "241102",
  population: "5000",
  totalHouseholds: "780",
  pradhanNaam: "vikas chauhan",
  pradhanContact: "9897989798",
  status: "Active",
};

function InfoBadge({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group">
      <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-foreground capitalize truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export function VillageProfileTab({ initialProfile }: VillageProfileTabProps) {
  const [isEditing, setIsEditing] = useState(!initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedProfile, setSavedProfile] = useState<VillageProfileData | null>(initialProfile || null);

  const [formData, setFormData] = useState<VillageProfileData>(
    initialProfile || INITIAL_FORM
  );

  const handleChange = (field: keyof VillageProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        population: parseInt(formData.population as string) || 0,
        totalHouseholds: parseInt(formData.totalHouseholds as string) || 0,
      };

      let response: Response;
      if (savedProfile?.id) {
        response = await fetch(`/api/constituency/village-profile/${savedProfile.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("/api/constituency/village-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (data.success) {
        setSavedProfile({ ...formData, id: data.profile?.id || savedProfile?.id });
        setIsEditing(false);
        toast.success("Village Profile safaltapoovak save ho gaya! ✅");
      } else {
        toast.error(data.message || "Save karne mein samasya aayi.");
      }
    } catch {
      toast.error("Ek bekaar error aayi. Dobara koshish karein.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (savedProfile) {
      setFormData(savedProfile);
      setIsEditing(false);
    }
  };

  // ── View Mode ──────────────────────────────────────────────────────────────────
  if (!isEditing && savedProfile) {
    return (
      <div className="space-y-5 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
        {/* Header Card */}
        <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden relative">
          <div className="absolute right-0 top-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold capitalize">
                    {savedProfile.gramPanchayatNaam}
                  </CardTitle>
                  <CardDescription className="text-sm mt-0.5 capitalize">
                    {savedProfile.village} • {savedProfile.block} • {savedProfile.district}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    savedProfile.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                      savedProfile.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {savedProfile.status}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-1.5 border-primary/30 hover:bg-primary/5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/50">
            <div className="px-5 py-4 text-center">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Population</p>
              <p className="text-2xl font-black text-foreground">{Number(savedProfile.population).toLocaleString("en-IN")}</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Households</p>
              <p className="text-2xl font-black text-foreground">{Number(savedProfile.totalHouseholds).toLocaleString("en-IN")}</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">PIN Code</p>
              <p className="text-2xl font-black text-foreground">{savedProfile.pinCode}</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">State</p>
              <p className="text-lg font-black text-foreground">{savedProfile.state}</p>
            </div>
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Geographic Info */}
          <Card className="glass shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <MapPin className="h-4 w-4 text-primary" />
                Bhaugolik Jaankari
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 gap-2.5">
              <InfoBadge label="Gram Panchayat Naam" value={savedProfile.gramPanchayatNaam} icon={Building2} />
              <InfoBadge label="Village" value={savedProfile.village} icon={Home} />
              <InfoBadge label="Block" value={savedProfile.block} icon={MapPin} />
              <InfoBadge label="District" value={savedProfile.district} icon={MapPin} />
              <InfoBadge label="State" value={savedProfile.state} icon={MapPin} />
              <InfoBadge label="PIN Code" value={savedProfile.pinCode} icon={Hash} />
            </CardContent>
          </Card>

          {/* Pradhan & Population Info */}
          <div className="space-y-4">
            <Card className="glass shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                  <User className="h-4 w-4 text-indigo-500" />
                  Pradhan Ki Jaankari
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 gap-2.5">
                <InfoBadge label="Pradhan ka Naam" value={savedProfile.pradhanNaam} icon={User} />
                <InfoBadge label="Pradhan ka Contact" value={savedProfile.pradhanContact} icon={Phone} />
              </CardContent>
            </Card>

            <Card className="glass shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                  <Users className="h-4 w-4 text-emerald-500" />
                  Jansankhya Jaankari
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 gap-2.5">
                <InfoBadge label="Anumaanit Population" value={Number(savedProfile.population).toLocaleString("en-IN")} icon={Users} />
                <InfoBadge label="Anumaanit Total Households" value={Number(savedProfile.totalHouseholds).toLocaleString("en-IN")} icon={Home} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ── Edit / Add Mode ───────────────────────────────────────────────────────────
  return (
    <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      <Card className="glass-card">
        <CardHeader className="border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {savedProfile ? "Village Profile Edit Karein" : "Village Profile Darj Karein"}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Gram Panchayat ki basic jaankari yahan fill karein
                </CardDescription>
              </div>
            </div>
            {savedProfile && (
              <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Geographic Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-md bg-blue-500/10">
                  <MapPin className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Bhaugolik Jaankari</h3>
                <div className="flex-1 h-px bg-border/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Gram Panchayat Naam <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. pinna Gram Panchayat"
                    value={formData.gramPanchayatNaam}
                    onChange={(e) => handleChange("gramPanchayatNaam", e.target.value)}
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Village <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. pinna"
                    value={formData.village}
                    onChange={(e) => handleChange("village", e.target.value)}
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Block <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. baghra"
                    value={formData.block}
                    onChange={(e) => handleChange("block", e.target.value)}
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    District <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. muzaffarnagar"
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">State</label>
                  <Input
                    placeholder="e.g. Uttar Pradesh"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="bg-background/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">PIN Code</label>
                  <Input
                    placeholder="e.g. 241102"
                    value={formData.pinCode}
                    onChange={(e) => handleChange("pinCode", e.target.value)}
                    className="bg-background/60"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Population Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-md bg-emerald-500/10">
                  <Users className="h-4 w-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Jansankhya Jaankari</h3>
                <div className="flex-1 h-px bg-border/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Anumaanit Population
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.population}
                    onChange={(e) => handleChange("population", e.target.value)}
                    className="bg-background/60"
                    min={0}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Anumaanit Total Households
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 780"
                    value={formData.totalHouseholds}
                    onChange={(e) => handleChange("totalHouseholds", e.target.value)}
                    className="bg-background/60"
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Pradhan Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-md bg-indigo-500/10">
                  <User className="h-4 w-4 text-indigo-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Pradhan Ki Jaankari</h3>
                <div className="flex-1 h-px bg-border/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Pradhan ka Naam <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. vikas chauhan"
                    value={formData.pradhanNaam}
                    onChange={(e) => handleChange("pradhanNaam", e.target.value)}
                    className="bg-background/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Pradhan ka Contact</label>
                  <Input
                    placeholder="e.g. 9897989798"
                    value={formData.pradhanContact}
                    onChange={(e) => handleChange("pradhanContact", e.target.value)}
                    className="bg-background/60"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-md bg-amber-500/10">
                  <Info className="h-4 w-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Status</h3>
                <div className="flex-1 h-px bg-border/50" />
              </div>
              <div className="max-w-xs">
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleChange("status", v || "Active")}
                >
                  <SelectTrigger className="bg-background/60">
                    <SelectValue placeholder="Status chunein" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </SelectItem>
                    <SelectItem value="Inactive">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        Inactive
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="text-destructive">*</span> zaroori fields
              </p>
              <div className="flex gap-3">
                {savedProfile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.gramPanchayatNaam || !formData.village || !formData.pradhanNaam}
                  className="gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {savedProfile ? "Update Karein" : "Save Karein"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
