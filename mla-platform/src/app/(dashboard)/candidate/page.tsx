import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { User, Phone, Mail, MapPin, Landmark, Award, Briefcase, GraduationCap, Globe, Link as LinkIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Candidate Profile | MLA Platform",
  description: "View and manage complete candidate information",
};

export default async function CandidateProfilePage() {
  const constituency = await prisma.constituency.findFirst();
  const candidate = await prisma.candidateProfile.findFirst({
    include: { user: true }
  });

  // Default fallback data if no candidate profile exists in DB yet
  const defaultCandidate = {
    name: "Rajesh Sharma",
    designation: "Senior Party Leader & Candidate",
    email: "amarinder.s@constituencyos.org",
    phone: "+91 98765 43210",
    biography: "Rajesh Sharma is a dedicated public servant and community leader with over 15 years of experience in regional governance. Born and raised in the heart of the constituency, he has championed numerous development projects focusing on rural infrastructure, clean water access, and educational reforms. Known for his grassroots approach, Amarinder has consistently worked towards uniting diverse community factions and bridging the gap between local citizens and state resources.",
    photoUrl: "https://ui-avatars.com/api/?name=Amarinder+Singh&size=256&background=0D8ABC&color=fff",
    education: null,
    experience: null,
    publicProfile: null,
    politicalInfo: null,
  };

  const name = candidate?.name || defaultCandidate.name;
  const designation = candidate?.designation || defaultCandidate.designation;
  const email = candidate?.email || defaultCandidate.email;
  const phone = candidate?.phone || defaultCandidate.phone;
  const biography = candidate?.biography || defaultCandidate.biography;
  const photoUrl = candidate?.photoUrl || defaultCandidate.photoUrl;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Profile"
        description="View and manage complete candidate information"
        icon={User}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Core Identity & Contact */}
        <div className="space-y-6 md:col-span-1">
          {/* Photograph, Name, Designation */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4 ring-4 ring-primary/10">
                <AvatarImage src={photoUrl} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-bold">
                  {name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
              <p className="text-sm font-medium text-primary mt-1">{designation}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{constituency?.name || "Constituency"}</p>
              <Badge className="mt-4 bg-primary/10 text-primary hover:bg-primary/20 border-0">Official Nominee</Badge>
            </CardContent>
          </Card>

          {/* Contact Information & Public Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact & Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>{constituency?.name}, {constituency?.state}, India</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3.5 text-sm">
                <h4 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Public Profiles</h4>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <Globe className="h-4 w-4 shrink-0" />
                  <span>Website</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <LinkIcon className="h-4 w-4 shrink-0" />
                  <span>Twitter Profile</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <LinkIcon className="h-4 w-4 shrink-0" />
                  <span>Facebook Page</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bio, Experience, Political Info */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Biography */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Biography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {biography}
              </p>
            </CardContent>
          </Card>

          {/* Political & Organisation Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Political & Organisation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl border bg-card flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Affiliation</h4>
                    <p className="text-xs text-muted-foreground mt-1">Democratic Unity Coalition (DUC)</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-card flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Current Term</h4>
                    <p className="text-xs text-muted-foreground mt-1">Challenger for Upcoming 2027 Election</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education & Experience */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative border-l-2 border-muted pl-4 ml-2 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background"></div>
                    <h4 className="font-semibold text-sm">Masters in Public Administration</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Punjab University • 2008 - 2010</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-muted bg-background"></div>
                    <h4 className="font-semibold text-sm">B.A. Political Science</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Delhi University • 2005 - 2008</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative border-l-2 border-muted pl-4 ml-2 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background"></div>
                    <h4 className="font-semibold text-sm">General Secretary</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">State Party Committee • 2018 - Present</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-muted bg-background"></div>
                    <h4 className="font-semibold text-sm">District President</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Youth Wing • 2012 - 2018</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
