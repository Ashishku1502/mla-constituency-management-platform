"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Users, Plus, Search, Filter, Mail, Phone, MapPin, Building2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function VolunteersClient({ initialVolunteers }: { initialVolunteers: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteers, setVolunteers] = useState(initialVolunteers);

  const filteredVolunteers = volunteers.filter((vol) => {
    const query = searchQuery.toLowerCase();
    return (
      vol.user.name.toLowerCase().includes(query) ||
      vol.user.mobile.includes(query) ||
      vol.area.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Volunteers"
        description="Manage your grassroots team and household assignments"
        icon={Users}
        action={{ label: "Add Volunteer", href: "/team/volunteers/add", icon: Plus }}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or area..."
            className="pl-9 bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-all rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto rounded-full shadow-sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Badge variant="secondary" className="px-3 py-1.5 rounded-full text-sm font-medium">
            Total: {volunteers.length}
          </Badge>
        </div>
      </div>

      {filteredVolunteers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500 bg-card rounded-xl border shadow-sm border-dashed">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-2">No volunteers found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            We couldn't find any volunteers matching your current search criteria.
          </p>
          <Button variant="outline" className="rounded-full shadow-sm" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredVolunteers.map((vol) => (
            <Card key={vol.id} className="group overflow-hidden transition-all duration-300 hover:shadow-md border-none ring-1 ring-border hover:ring-primary/20">
              <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative">
                <Badge variant={vol.user.status === 'Active' ? 'default' : 'secondary'} className="absolute top-4 right-4 shadow-sm">
                  {vol.user.status}
                </Badge>
              </div>
              <CardContent className="px-5 pb-5 pt-0 relative">
                <Avatar className="h-16 w-16 border-4 border-card absolute -top-8 left-4 shadow-sm bg-muted text-lg font-semibold">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {vol.user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex justify-end pt-3">
                  <DropdownMenu>
                    {/* @ts-expect-error DropdownMenuTrigger asChild typing issue */}
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-2 space-y-1.5">
                  <h3 className="text-lg font-bold tracking-tight line-clamp-1">{vol.user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{vol.user.mobile}</span>
                  </div>
                  {vol.user.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors line-clamp-1">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{vol.user.email}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-3 pt-5 border-t border-border/50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-7 w-7 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Area</span>
                        <span className="font-semibold text-foreground/90">{vol.area.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-7 w-7 rounded-md bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Polling Station</span>
                        <span className="font-medium text-foreground/80 line-clamp-1">{vol.pollingStation?.name || "Unassigned"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Households</span>
                  <span className="text-base font-bold text-primary">{vol.householdsCount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
