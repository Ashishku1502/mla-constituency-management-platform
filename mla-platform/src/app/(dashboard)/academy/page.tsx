import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { GraduationCap, Play, BookOpen, Clock, CheckCircle2 } from "lucide-react";

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
    <div className="space-y-6">
      <PageHeader title="Academy" description="Training courses, modules, and assessments for team development" icon={GraduationCap} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"><BookOpen className="h-4.5 w-4.5" /></div>
            <div><p className="text-xs text-muted-foreground">Total Courses</p><p className="text-lg font-bold">{courses.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="h-4.5 w-4.5" /></div>
            <div><p className="text-xs text-muted-foreground">In Progress</p><p className="text-lg font-bold">{courses.filter(c => c.status === "In Progress").length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle2 className="h-4.5 w-4.5" /></div>
            <div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{courses.filter(c => c.status === "Completed").length}</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No courses available yet.
          </div>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-all duration-200 group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  <Badge variant="secondary" className={
                    course.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    course.status === "In Progress" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-gray-100 text-gray-600"
                  }>{course.status}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.modulesCount} modules</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
                <Button variant={course.progress === 0 ? "default" : "outline"} size="sm" className="w-full gap-1.5">
                  <Play className="h-3.5 w-3.5" />
                  {course.progress === 0 ? "Start Course" : course.progress === 100 ? "Review" : "Continue"}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
