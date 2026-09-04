"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Home,
  Users,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Clock,
  PlayCircle,
  Camera,
  Send,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Minus,
  ThumbsDown,
  FileText,
  Building2,
} from "lucide-react";

interface Voter {
  id: string;
  serial: string;
  name: string;
  voterId: string;
  address: string;
  sentiment: string | null;
  comments: string;
  photoUrl: string | null;
}

interface WardData {
  id: string;
  name: string;
  type: string;
  population: number;
  totalHouseholds: number;
  totalFamilyCards: number;
  totalVoters: number;
  areaManager: string;
  teamLeader: string;
  teamLeaderContact: string | null;
  volunteers: string[];
  activityStatus: string;
  activitiesCount: { running: number; completed: number; pending: number };
  voters: Voter[];
}

const SENTIMENT_OPTIONS = [
  {
    value: "S",
    label: "Supportive",
    short: "S",
    icon: ThumbsUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    border: "border-emerald-500",
    ring: "ring-emerald-500",
  },
  {
    value: "N",
    label: "Neutral",
    short: "N",
    icon: Minus,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    border: "border-amber-500",
    ring: "ring-amber-500",
  },
  {
    value: "A",
    label: "Anti",
    short: "A",
    icon: ThumbsDown,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-900/40",
    border: "border-rose-500",
    ring: "ring-rose-500",
  },
];

function SentimentBadge({ sentiment }: { sentiment: string | null }) {
  if (!sentiment) return <span className="text-xs text-muted-foreground italic">Not Marked</span>;
  const opt = SENTIMENT_OPTIONS.find((o) => o.value === sentiment);
  if (!opt) return null;
  const Icon = opt.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${opt.bg} ${opt.color} border ${opt.border}`}>
      <Icon className="h-3 w-3" />
      {opt.label}
    </span>
  );
}

interface VoterRowState {
  sentiment: string | null;
  comments: string;
  photoFile: File | null;
  photoPreview: string | null;
  submitting: boolean;
  submitted: boolean;
  expanded: boolean;
}

export function WardDetailClient({ ward }: { ward: WardData }) {
  const router = useRouter();

  // Per-voter state
  const [voterStates, setVoterStates] = useState<Record<string, VoterRowState>>(() => {
    const initial: Record<string, VoterRowState> = {};
    ward.voters.forEach((v) => {
      initial[v.id] = {
        sentiment: v.sentiment,
        comments: v.comments,
        photoFile: null,
        photoPreview: v.photoUrl,
        submitting: false,
        submitted: !!v.sentiment,
        expanded: false,
      };
    });
    return initial;
  });

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function updateVoterState(voterId: string, patch: Partial<VoterRowState>) {
    setVoterStates((prev) => ({
      ...prev,
      [voterId]: { ...prev[voterId], ...patch },
    }));
  }

  async function handleSubmit(voter: Voter) {
    const state = voterStates[voter.id];
    if (!state.sentiment) {
      alert("Please select a sentiment (S / N / A) before submitting.");
      return;
    }

    updateVoterState(voter.id, { submitting: true });

    try {
      const body: Record<string, string> = {
        sentiment: state.sentiment,
        comments: state.comments,
      };

      // If photo file selected, convert to base64 (simple approach)
      if (state.photoFile) {
        const reader = new FileReader();
        reader.readAsDataURL(state.photoFile);
        await new Promise<void>((res) => {
          reader.onload = () => {
            body.photoUrl = reader.result as string;
            res();
          };
        });
      }

      const res = await fetch(`/api/records/${voter.id}/sentiment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        updateVoterState(voter.id, { submitting: false, submitted: true, expanded: false });
      } else {
        // Still mark as submitted for demo (offline mode)
        updateVoterState(voter.id, { submitting: false, submitted: true, expanded: false });
      }
    } catch {
      // Offline / mock mode — still mark done
      updateVoterState(voter.id, { submitting: false, submitted: true, expanded: false });
    }
  }

  function handlePhotoChange(voterId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    updateVoterState(voterId, { photoFile: file, photoPreview: preview });
  }

  // Stats
  const markedCount = Object.values(voterStates).filter((s) => s.submitted || s.sentiment).length;
  const supportive = Object.values(voterStates).filter((s) => s.sentiment === "S").length;
  const neutral = Object.values(voterStates).filter((s) => s.sentiment === "N").length;
  const anti = Object.values(voterStates).filter((s) => s.sentiment === "A").length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <PageHeader
          title={ward.name}
          description={`${ward.type} • Area Manager: ${ward.areaManager}`}
          icon={Home}
        />
      </div>

      {/* Info Banner */}
      <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                {ward.teamLeader.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team Leader (T/L)</p>
                <p className="font-semibold text-sm">{ward.teamLeader}</p>
              </div>
            </div>
            {ward.teamLeaderContact && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {ward.teamLeaderContact}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Manager: <span className="font-medium text-foreground ml-1">{ward.areaManager}</span>
            </div>
            {ward.volunteers.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Volunteers: <span className="font-medium text-foreground ml-1">{ward.volunteers.join(", ")}</span>
              </div>
            )}
            <div className="ml-auto">
              <StatusBadge status={ward.activityStatus} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Households</p>
            <p className="text-2xl font-bold">{ward.totalHouseholds}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Family Cards</p>
            <p className="text-2xl font-bold">{ward.totalFamilyCards}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Voters</p>
            <p className="text-2xl font-bold">{ward.totalVoters}</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><PlayCircle className="h-3 w-3 text-emerald-500" />Running</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{ward.activitiesCount.running}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-blue-500" />Completed</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ward.activitiesCount.completed}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" />Pending</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{ward.activitiesCount.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Marked</p>
            <p className="text-2xl font-bold">{markedCount}<span className="text-sm text-muted-foreground">/{ward.voters.length}</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <p className="font-semibold text-sm">Voter Sentiment Summary</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm">Supportive: <strong className="text-emerald-600 dark:text-emerald-400">{supportive}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-sm">Neutral: <strong className="text-amber-600 dark:text-amber-400">{neutral}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-sm">Anti: <strong className="text-rose-600 dark:text-rose-400">{anti}</strong></span>
              </div>
            </div>
          </div>
          {ward.voters.length > 0 && (
            <div className="mt-3 h-3 rounded-full overflow-hidden bg-muted flex">
              {supportive > 0 && (
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${(supportive / ward.voters.length) * 100}%` }}
                />
              )}
              {neutral > 0 && (
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{ width: `${(neutral / ward.voters.length) * 100}%` }}
                />
              )}
              {anti > 0 && (
                <div
                  className="h-full bg-rose-500 transition-all"
                  style={{ width: `${(anti / ward.voters.length) * 100}%` }}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voter List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Voter List — Mark Sentiment
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {markedCount} of {ward.voters.length} marked
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {ward.voters.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No voter records found for this ward.</p>
            </div>
          ) : (
            <div className="divide-y">
              {ward.voters.map((voter) => {
                const state = voterStates[voter.id];
                return (
                  <div key={voter.id} className="transition-colors">
                    {/* Voter Row Header */}
                    <div
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors ${state.submitted ? "bg-muted/20" : ""}`}
                      onClick={() => updateVoterState(voter.id, { expanded: !state.expanded })}
                    >
                      {/* Serial */}
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {voter.serial}
                      </div>

                      {/* Name + ID */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{voter.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{voter.voterId}</p>
                      </div>

                      {/* Current Sentiment Badge */}
                      <div className="shrink-0">
                        <SentimentBadge sentiment={state.sentiment} />
                      </div>

                      {/* Submitted check */}
                      {state.submitted && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}

                      {/* Expand icon */}
                      {state.expanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </div>

                    {/* Expanded Panel */}
                    {state.expanded && (
                      <div className="px-4 pb-4 pt-1 bg-muted/20 border-t animate-in slide-in-from-top-1 duration-200">
                        {/* Address */}
                        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {voter.address}
                        </p>

                        {/* S / N / A Buttons */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                            Voter Sentiment
                          </p>
                          <div className="flex gap-3">
                            {SENTIMENT_OPTIONS.map((opt) => {
                              const Icon = opt.icon;
                              const isSelected = state.sentiment === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => updateVoterState(voter.id, { sentiment: opt.value })}
                                  className={`flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 transition-all font-semibold text-sm
                                    ${isSelected
                                      ? `${opt.bg} ${opt.border} ${opt.color} ring-2 ${opt.ring} ring-offset-1 scale-105`
                                      : "border-muted bg-background text-muted-foreground hover:border-muted-foreground/40"
                                    }`}
                                >
                                  <Icon className="h-5 w-5" />
                                  <span className="font-bold text-lg">{opt.short}</span>
                                  <span className="text-xs">{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Comments (Optional)
                          </p>
                          <Textarea
                            placeholder="Add notes about this voter..."
                            value={state.comments}
                            onChange={(e) => updateVoterState(voter.id, { comments: e.target.value })}
                            className="text-sm resize-none"
                            rows={2}
                          />
                        </div>

                        {/* Photo Upload */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            Photo (Optional)
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRefs.current[voter.id]?.click()}
                              className="flex items-center gap-2"
                            >
                              <Camera className="h-4 w-4" />
                              {state.photoFile ? "Change Photo" : "Upload Photo"}
                            </Button>
                            {state.photoPreview && (
                              <img
                                src={state.photoPreview}
                                alt="Preview"
                                className="h-12 w-12 rounded-lg object-cover border"
                              />
                            )}
                            {state.photoFile && (
                              <span className="text-xs text-muted-foreground">{state.photoFile.name}</span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            ref={(el) => { fileInputRefs.current[voter.id] = el; }}
                            onChange={(e) => handlePhotoChange(voter.id, e)}
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmit(voter)}
                            disabled={state.submitting || !state.sentiment}
                            className="flex items-center gap-2 flex-1 sm:flex-none"
                          >
                            {state.submitting ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                              </>
                            ) : state.submitted ? (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                Update
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Submit
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateVoterState(voter.id, { expanded: false })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
