import {
  LayoutDashboard,
  User,
  MapPin,
  Map,
  Building2,
  Vote,
  Home,
  Shield,
  Users,
  UserCheck,
  UserPlus,
  GitBranch,
  Database,
  ListChecks,
  ClipboardList,
  Calendar,
  Activity,
  FileBarChart,
  FileText,
  AlertTriangle,
  GraduationCap,
  FolderOpen,
  Bell,
  Settings,
  ShieldCheck,
  Radio,
  Eye,
  Zap,
  Target,
  Package,
  type LucideIcon,
} from "lucide-react";

// ─── Application ────────────────────────────────────────────────────────────────

export const APP_NAME = "ConstituencyOS";
export const APP_DESCRIPTION =
  "Assembly Constituency Digital Management Platform";
export const APP_VERSION = "1.0.0";

// ─── Roles ──────────────────────────────────────────────────────────────────────

export const ROLES = {
  CANDIDATE: "Candidate",
  ADMIN: "Admin",
  AREA_MANAGER: "Area Manager",
  TEAM_LEADER: "Team Leader",
  VOLUNTEER: "Volunteer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ─── Statuses ───────────────────────────────────────────────────────────────────

export const AREA_STATUSES = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export const POLLING_STATION_STATUSES = {
  VALIDATED: "Validated",
  PENDING: "Pending",
  ERROR: "Error",
} as const;

export const ACTIVITY_STATUSES = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  SCHEDULED: "Scheduled",
  ASSIGNED: "Assigned",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  SUBMITTED: "Submitted",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  REOPENED: "Reopened",
  CANCELLED: "Cancelled",
  OVERDUE: "Overdue",
} as const;

export const ISSUE_STATUSES = {
  NEW: "New",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  PENDING: "Pending",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
} as const;

export const ISSUE_PRIORITIES = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
} as const;

export const ISSUE_CATEGORIES = [
  "Roads",
  "Water",
  "Electricity",
  "Drainage",
  "Sanitation",
  "Education",
  "Healthcare",
  "Employment",
  "Transport",
  "Government Services",
  "Other",
] as const;

export const REPORT_STATUSES = {
  SUBMITTED: "Submitted",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  REOPENED: "Reopened",
} as const;

export const HOUSEHOLD_VERIFICATION = {
  VERIFIED: "Verified",
  PENDING: "Pending",
  UNVERIFIED: "Unverified",
} as const;

// ─── Status Colors ──────────────────────────────────────────────────────────────

export const STATUS_COLORS: Record<string, string> = {
  // General
  Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",

  // Activity
  Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Scheduled: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  Assigned: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  Accepted: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "In Progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Submitted: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  Verified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Reopened: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500",
  Overdue: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",

  // Issues
  New: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Resolved: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  Closed: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",

  // Polling Station
  Validated: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",

  // Household
  Unverified: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",

  // Priority
  Low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

// ─── Navigation ─────────────────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: Role[];
  children?: NavItem[];
  badge?: string;
}

export const NAVIGATION: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Candidate Profile",
    href: "#",
    icon: Package,
    children: [
      {
        title: "Personal Information",
        href: "/candidate/personal-info",
        icon: User,
        roles: [ROLES.CANDIDATE, ROLES.ADMIN],
      },
      {
        title: "Constituency Information",
        href: "/constituency/add",
        icon: GraduationCap,
      },
      {
        title: "Profile Dashboard",
        href: "/profile-dashboard",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Constituency",
    href: "/constituency",
    icon: MapPin,
    children: [
      { title: "Map", href: "/constituency/map", icon: Map },
      { title: "Areas", href: "/constituency/areas", icon: Building2 },
      {
        title: "Polling Stations",
        href: "/constituency/polling-stations",
        icon: Vote,
      },
      {
        title: "Wards / Villages",
        href: "/constituency/wards",
        icon: Home,
      },
    ],
  },
  {
    title: "Election War Room",
    href: "/war-room",
    icon: Shield,
    roles: [ROLES.CANDIDATE, ROLES.ADMIN],
    children: [
      { title: "Live Map", href: "/war-room/live-map", icon: Radio },
      {
        title: "Organization",
        href: "/war-room/organization",
        icon: GitBranch,
      },
      { title: "Activities", href: "/war-room/activities", icon: Activity },
      {
        title: "Ground Monitoring",
        href: "/war-room/ground",
        icon: Eye,
      },
      { title: "Alerts", href: "/war-room/alerts", icon: Zap },
    ],
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    children: [
      {
        title: "Area Managers",
        href: "/team/area-managers",
        icon: UserCheck,
      },
      { title: "Team Leaders", href: "/team/team-leaders", icon: UserPlus },
      { title: "Volunteers", href: "/team/volunteers", icon: Users },
      {
        title: "Organization Tree",
        href: "/team/org-tree",
        icon: GitBranch,
      },
    ],
  },
  {
    title: "Records",
    href: "/records",
    icon: Database,
    children: [
      {
        title: "Record Database",
        href: "/records/database",
        icon: Database,
      },
      {
        title: "Polling Station Lists",
        href: "/records/polling-station-lists",
        icon: ListChecks,
      },
      { title: "Households", href: "/records/households", icon: Home },
      { title: "Family Members", href: "/records/family-members", icon: Users },
      {
        title: "Data Validation",
        href: "/records/validation",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Activities",
    href: "/activities",
    icon: ClipboardList,
    children: [
      { title: "Activities", href: "/activities", icon: ClipboardList },
      {
        title: "Assignments",
        href: "/activities/assignments",
        icon: UserCheck,
      },
      { title: "Calendar", href: "/activities/calendar", icon: Calendar },
      { title: "Tracking", href: "/activities/tracking", icon: Activity },
      { title: "Reports", href: "/activities/reports", icon: FileBarChart },
    ],
  },
  {
    title: "Ground Reports",
    href: "/ground-reports",
    icon: FileText,
  },
  {
    title: "Issues",
    href: "/issues",
    icon: AlertTriangle,
  },
  {
    title: "Academy",
    href: "/academy",
    icon: GraduationCap,
  },
  {
    title: "Reports & Analytics",
    href: "/analytics",
    icon: FileBarChart,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FolderOpen,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Admin Panel",
    href: "/admin",
    icon: Target,
    roles: [ROLES.CANDIDATE, ROLES.ADMIN],
  },
];
