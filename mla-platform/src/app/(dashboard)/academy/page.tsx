import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { GraduationCap, Play, BookOpen, Clock, CheckCircle2, ArrowRight, Video, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Academy | MLA Platform",
  description: "Training courses, modules, and assessments for team development",
};

export default async function AcademyPage() {
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-10 rounded-3xl border-border/50 border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-primary" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Badge variant="secondary" className="mb-2 bg-background/50 backdrop-blur-sm border-primary/20">Training Center</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Grassroots Academy</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Empower your team with localized training modules, survey protocols, and effective communication strategies.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border shadow-sm flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-3xl font-black text-primary">{courses.length}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Modules</span>
            </div>
            <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border shadow-sm flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-3xl font-black text-emerald-500">{courses.filter(c => c.status === "Completed").length}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-muted/20 rounded-3xl border border-dashed">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
            <p className="text-muted-foreground max-w-md">Your academy modules will appear here once they are published.</p>
          </div>
        ) : (
          courses.map((course, i) => (
            <Card key={course.id} className="group overflow-hidden rounded-3xl border-border/60 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 relative flex flex-col h-full bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary/60 to-primary/20" />
              
              <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    {course.title.toLowerCase().includes("video") ? (
                      <Video className="h-6 w-6 text-primary" />
                    ) : course.title.toLowerCase().includes("assessment") ? (
                      <Target className="h-6 w-6 text-primary" />
                    ) : (
                      <GraduationCap className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <Badge variant="secondary" className={cn(
                    "font-semibold shadow-sm",
                    course.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" :
                    course.status === "In Progress" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {course.status === "Completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {course.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm mt-2">{course.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 pt-0 flex flex-col flex-1 justify-between gap-6">
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/50">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary/60" />{course.duration}</span>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-primary/60" />{course.modulesCount} modules</span>
                </div>
                
                <div className="space-y-2.5 mt-auto">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-foreground/80">Progress</span>
                    <span className={course.progress === 100 ? "text-emerald-500" : "text-primary"}>{course.progress}%</span>
                  </div>
                  <Progress 
                    value={course.progress} 
                    className={cn(
                      "h-2.5 bg-muted/60", 
                      course.progress === 100 && "[&>div]:bg-emerald-500"
                    )} 
                  />
                </div>
                
                <Button 
                  variant={course.progress === 0 ? "default" : course.progress === 100 ? "outline" : "default"} 
                  className={cn(
                    "w-full rounded-xl h-12 gap-2 font-semibold shadow-sm transition-all",
                    course.progress > 0 && course.progress < 100 && "bg-primary/90 hover:bg-primary"
                  )}
                >
                  {course.progress === 0 ? (
                    <>Start Module <Play className="h-4 w-4" /></>
                  ) : course.progress === 100 ? (
                    <>Review Content <Trophy className="h-4 w-4 text-emerald-500" /></>
                  ) : (
                    <>Continue Learning <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
