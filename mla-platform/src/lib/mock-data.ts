// ─── Mock Data for Phase 1 UI ────────────────────────────────────────────────
// All data here is synthetic demo data used to power the UI before backend integration.

export const mockConstituency = {
  id: "const-001",
  name: "Anandpur Sahib",
  state: "Punjab",
  code: "AC-042",
  totalAreas: 8,
  totalPollingStations: 142,
  totalRecords: 48750,
  totalHouseholds: 12430,
  population: 215000,
};

export const mockAreas = [
  {
    id: "area-001",
    name: "Anandpur Sahib Urban",
    code: "ASU-01",
    population: 42000,
    registeredRecords: 9850,
    pollingStations: 24,
    wards: 6,
    villages: 0,
    manager: "Rajinder Singh",
    managerId: "user-003",
    status: "Active" as const,
    teamLeaders: 4,
    volunteers: 18,
    householdCoverage: 78,
  },
  {
    id: "area-002",
    name: "Kiratpur Sahib",
    code: "KS-02",
    population: 38000,
    registeredRecords: 8200,
    pollingStations: 20,
    wards: 4,
    villages: 8,
    manager: "Gurmeet Kaur",
    managerId: "user-004",
    status: "Active" as const,
    teamLeaders: 3,
    volunteers: 15,
    householdCoverage: 65,
  },
  {
    id: "area-003",
    name: "Nangal Township",
    code: "NT-03",
    population: 35000,
    registeredRecords: 7600,
    pollingStations: 18,
    wards: 5,
    villages: 3,
    manager: "Harpreet Gill",
    managerId: "user-005",
    status: "Active" as const,
    teamLeaders: 3,
    volunteers: 14,
    householdCoverage: 72,
  },
  {
    id: "area-004",
    name: "Bhakra Dam Area",
    code: "BD-04",
    population: 22000,
    registeredRecords: 5100,
    pollingStations: 14,
    wards: 2,
    villages: 12,
    manager: "Sukhdev Dhillon",
    managerId: "user-006",
    status: "Active" as const,
    teamLeaders: 2,
    volunteers: 10,
    householdCoverage: 58,
  },
  {
    id: "area-005",
    name: "Balachaur",
    code: "BL-05",
    population: 28000,
    registeredRecords: 6200,
    pollingStations: 16,
    wards: 3,
    villages: 10,
    manager: "Mandeep Brar",
    managerId: "user-007",
    status: "Active" as const,
    teamLeaders: 2,
    volunteers: 12,
    householdCoverage: 62,
  },
  {
    id: "area-006",
    name: "Ganguwal",
    code: "GW-06",
    population: 18000,
    registeredRecords: 4200,
    pollingStations: 12,
    wards: 2,
    villages: 14,
    manager: "Paramjit Sandhu",
    managerId: "user-008",
    status: "Active" as const,
    teamLeaders: 2,
    volunteers: 8,
    householdCoverage: 55,
  },
  {
    id: "area-007",
    name: "Takhtupura",
    code: "TK-07",
    population: 16000,
    registeredRecords: 3800,
    pollingStations: 10,
    wards: 2,
    villages: 9,
    manager: "Jaswinder Aulakh",
    managerId: "user-009",
    status: "Inactive" as const,
    teamLeaders: 1,
    volunteers: 5,
    householdCoverage: 42,
  },
  {
    id: "area-008",
    name: "Mehatpur",
    code: "MH-08",
    population: 16000,
    registeredRecords: 3800,
    pollingStations: 8,
    wards: 2,
    villages: 7,
    manager: "Unassigned",
    managerId: null,
    status: "Active" as const,
    teamLeaders: 1,
    volunteers: 6,
    householdCoverage: 48,
  },
];

export const mockPollingStations = [
  { id: "ps-001", number: 1, name: "Government Senior Secondary School", address: "Main Road, Anandpur Sahib", area: "Anandpur Sahib Urban", areaId: "area-001", teamLeader: "Balwinder Singh", recordCount: 520, status: "Validated" as const },
  { id: "ps-002", number: 2, name: "Primary School Hall", address: "Station Road, Anandpur Sahib", area: "Anandpur Sahib Urban", areaId: "area-001", teamLeader: "Gurpreet Kaur", recordCount: 485, status: "Validated" as const },
  { id: "ps-003", number: 3, name: "Community Center", address: "Gandhi Nagar, Anandpur Sahib", area: "Anandpur Sahib Urban", areaId: "area-001", teamLeader: "Amarjeet Singh", recordCount: 392, status: "Pending" as const },
  { id: "ps-004", number: 4, name: "Panchayat Bhawan", address: "Village Mehatpur", area: "Mehatpur", areaId: "area-008", teamLeader: "Kuldeep Sharma", recordCount: 310, status: "Validated" as const },
  { id: "ps-005", number: 5, name: "Middle School", address: "Kiratpur Sahib Main", area: "Kiratpur Sahib", areaId: "area-002", teamLeader: "Ranjit Kaur", recordCount: 445, status: "Validated" as const },
  { id: "ps-006", number: 6, name: "Government Primary School", address: "Nangal Road", area: "Nangal Township", areaId: "area-003", teamLeader: "Davinder Pal", recordCount: 398, status: "Pending" as const },
  { id: "ps-007", number: 7, name: "Gurudwara Hall", address: "Balachaur Town", area: "Balachaur", areaId: "area-005", teamLeader: "Harjot Singh", recordCount: 362, status: "Error" as const },
  { id: "ps-008", number: 8, name: "Youth Club Building", address: "Ganguwal Village", area: "Ganguwal", areaId: "area-006", teamLeader: "Unassigned", recordCount: 280, status: "Pending" as const },
];

export const mockTeamMembers = {
  areaManagers: [
    { id: "user-003", name: "Rajinder Singh", mobile: "98765xxxxx", area: "Anandpur Sahib Urban", status: "Active", joinedDate: "2024-01-15", activityCount: 45, lastActive: "2 hours ago", reportingStatus: "Compliant" },
    { id: "user-004", name: "Gurmeet Kaur", mobile: "98764xxxxx", area: "Kiratpur Sahib", status: "Active", joinedDate: "2024-02-01", activityCount: 38, lastActive: "1 hour ago", reportingStatus: "Compliant" },
    { id: "user-005", name: "Harpreet Gill", mobile: "98763xxxxx", area: "Nangal Township", status: "Active", joinedDate: "2024-01-20", activityCount: 32, lastActive: "3 hours ago", reportingStatus: "Compliant" },
    { id: "user-006", name: "Sukhdev Dhillon", mobile: "98762xxxxx", area: "Bhakra Dam Area", status: "Active", joinedDate: "2024-03-10", activityCount: 28, lastActive: "5 hours ago", reportingStatus: "Pending" },
    { id: "user-007", name: "Mandeep Brar", mobile: "98761xxxxx", area: "Balachaur", status: "Active", joinedDate: "2024-02-15", activityCount: 22, lastActive: "1 day ago", reportingStatus: "Overdue" },
  ],
  teamLeaders: [
    { id: "tl-001", name: "Balwinder Singh", mobile: "97651xxxxx", area: "Anandpur Sahib Urban", pollingStations: "PS 1, PS 2", status: "Active", joinedDate: "2024-03-01", activityCount: 28, lastActive: "30 min ago", reportingStatus: "Compliant" },
    { id: "tl-002", name: "Gurpreet Kaur", mobile: "97652xxxxx", area: "Anandpur Sahib Urban", pollingStations: "PS 3, PS 4", status: "Active", joinedDate: "2024-03-05", activityCount: 24, lastActive: "1 hour ago", reportingStatus: "Compliant" },
    { id: "tl-003", name: "Ranjit Kaur", mobile: "97653xxxxx", area: "Kiratpur Sahib", pollingStations: "PS 5, PS 6", status: "Active", joinedDate: "2024-03-10", activityCount: 20, lastActive: "2 hours ago", reportingStatus: "Pending" },
    { id: "tl-004", name: "Davinder Pal", mobile: "97654xxxxx", area: "Nangal Township", pollingStations: "PS 7, PS 8", status: "Active", joinedDate: "2024-04-01", activityCount: 18, lastActive: "4 hours ago", reportingStatus: "Compliant" },
  ],
  volunteers: [
    { id: "vol-001", name: "Amrit Pal", mobile: "96541xxxxx", area: "Anandpur Sahib Urban", pollingStation: "PS 1", status: "Active", joinedDate: "2024-04-15", activityCount: 15, lastActive: "20 min ago", households: 42, reportingStatus: "Compliant" },
    { id: "vol-002", name: "Simran Kaur", mobile: "96542xxxxx", area: "Anandpur Sahib Urban", pollingStation: "PS 1", status: "Active", joinedDate: "2024-04-20", activityCount: 12, lastActive: "1 hour ago", households: 38, reportingStatus: "Compliant" },
    { id: "vol-003", name: "Jagdeep Singh", mobile: "96543xxxxx", area: "Kiratpur Sahib", pollingStation: "PS 5", status: "Active", joinedDate: "2024-05-01", activityCount: 10, lastActive: "3 hours ago", households: 35, reportingStatus: "Pending" },
    { id: "vol-004", name: "Navneet Dhaliwal", mobile: "96544xxxxx", area: "Nangal Township", pollingStation: "PS 7", status: "Inactive", joinedDate: "2024-05-10", activityCount: 6, lastActive: "3 days ago", households: 22, reportingStatus: "Overdue" },
    { id: "vol-005", name: "Priya Sharma", mobile: "96545xxxxx", area: "Balachaur", pollingStation: "PS 8", status: "Active", joinedDate: "2024-06-01", activityCount: 8, lastActive: "2 hours ago", households: 28, reportingStatus: "Compliant" },
    { id: "vol-006", name: "Kulwant Bedi", mobile: "96546xxxxx", area: "Anandpur Sahib Urban", pollingStation: "PS 2", status: "Active", joinedDate: "2024-06-15", activityCount: 11, lastActive: "45 min ago", households: 32, reportingStatus: "Compliant" },
  ],
};

export const mockHouseholds = [
  { id: "hh-001", houseNumber: "H-142", headOfHousehold: "Mohinder Singh", contact: "98765xxxxx", address: "42, Gandhi Nagar", locality: "Gandhi Nagar", pollingStation: "PS 1", ward: "Ward 1", familyMembers: 5, verificationStatus: "Verified" as const, lastUpdated: "2024-07-15", assignedVolunteer: "Amrit Pal" },
  { id: "hh-002", houseNumber: "H-143", headOfHousehold: "Jasbir Kaur", contact: "98764xxxxx", address: "43, Gandhi Nagar", locality: "Gandhi Nagar", pollingStation: "PS 1", ward: "Ward 1", familyMembers: 4, verificationStatus: "Verified" as const, lastUpdated: "2024-07-14", assignedVolunteer: "Amrit Pal" },
  { id: "hh-003", houseNumber: "H-205", headOfHousehold: "Paramjit Bains", contact: "98763xxxxx", address: "15, Station Road", locality: "Station Road", pollingStation: "PS 2", ward: "Ward 2", familyMembers: 6, verificationStatus: "Pending" as const, lastUpdated: "2024-07-10", assignedVolunteer: "Kulwant Bedi" },
  { id: "hh-004", houseNumber: "H-312", headOfHousehold: "Surinder Dhawan", contact: "98762xxxxx", address: "78, Main Market", locality: "Main Market", pollingStation: "PS 3", ward: "Ward 3", familyMembers: 3, verificationStatus: "Unverified" as const, lastUpdated: "2024-06-28", assignedVolunteer: "Simran Kaur" },
  { id: "hh-005", houseNumber: "H-418", headOfHousehold: "Amandeep Gill", contact: "98761xxxxx", address: "22, Nangal Road", locality: "Nangal Road", pollingStation: "PS 5", ward: "Ward 4", familyMembers: 7, verificationStatus: "Verified" as const, lastUpdated: "2024-07-12", assignedVolunteer: "Jagdeep Singh" },
  { id: "hh-006", houseNumber: "H-521", headOfHousehold: "Baldev Raj", contact: "98760xxxxx", address: "9, Kiratpur Market", locality: "Kiratpur Market", pollingStation: "PS 5", ward: "Ward 5", familyMembers: 4, verificationStatus: "Verified" as const, lastUpdated: "2024-07-08", assignedVolunteer: "Jagdeep Singh" },
];

export const mockActivities = [
  { id: "act-001", name: "Door-to-Door Household Survey", category: "Survey", description: "Complete household survey in Ward 1", objective: "Verify and update household information", date: "2024-08-20", startTime: "09:00", endTime: "17:00", location: "Ward 1, Gandhi Nagar", area: "Anandpur Sahib Urban", pollingStation: "PS 1", teamLeader: "Balwinder Singh", volunteers: 4, capacity: 6, status: "In Progress" as const, deadline: "2024-08-25" },
  { id: "act-002", name: "Community Meeting - Water Supply", category: "Meeting", description: "Community meeting to discuss water supply issues", objective: "Gather community input on water infrastructure", date: "2024-08-22", startTime: "16:00", endTime: "18:00", location: "Community Center, Anandpur Sahib", area: "Anandpur Sahib Urban", pollingStation: "PS 3", teamLeader: "Gurpreet Kaur", volunteers: 2, capacity: 3, status: "Scheduled" as const, deadline: "2024-08-22" },
  { id: "act-003", name: "Polling Station Verification", category: "Verification", description: "Verify polling station records and facilities", objective: "Ensure data accuracy and station readiness", date: "2024-08-18", startTime: "10:00", endTime: "15:00", location: "PS 5, Kiratpur Sahib", area: "Kiratpur Sahib", pollingStation: "PS 5", teamLeader: "Ranjit Kaur", volunteers: 3, capacity: 3, status: "Completed" as const, deadline: "2024-08-20" },
  { id: "act-004", name: "Road Infrastructure Assessment", category: "Survey", description: "Document road conditions in Balachaur area", objective: "Prepare infrastructure improvement report", date: "2024-08-25", startTime: "08:00", endTime: "14:00", location: "Balachaur Main Road", area: "Balachaur", pollingStation: "PS 8", teamLeader: "Davinder Pal", volunteers: 2, capacity: 4, status: "Draft" as const, deadline: "2024-08-30" },
  { id: "act-005", name: "Volunteer Training Session", category: "Training", description: "Training for new volunteers on data collection", objective: "Onboard new volunteers", date: "2024-08-15", startTime: "10:00", endTime: "16:00", location: "Nangal Township Office", area: "Nangal Township", pollingStation: "PS 7", teamLeader: "Davinder Pal", volunteers: 6, capacity: 10, status: "Verified" as const, deadline: "2024-08-15" },
  { id: "act-006", name: "Healthcare Camp Coordination", category: "Event", description: "Coordinate with health department for free health check-up camp", objective: "Facilitate community healthcare access", date: "2024-08-28", startTime: "09:00", endTime: "17:00", location: "Government School, Ganguwal", area: "Ganguwal", pollingStation: "PS 8", teamLeader: "Unassigned", volunteers: 0, capacity: 5, status: "Approved" as const, deadline: "2024-08-27" },
  { id: "act-007", name: "Data Entry Audit - Ward 3", category: "Audit", description: "Audit data entry quality for Ward 3 households", objective: "Ensure data quality standards", date: "2024-08-12", startTime: "09:00", endTime: "13:00", location: "Office, Anandpur Sahib", area: "Anandpur Sahib Urban", pollingStation: "PS 3", teamLeader: "Gurpreet Kaur", volunteers: 1, capacity: 2, status: "Overdue" as const, deadline: "2024-08-14" },
];

export const mockGroundReports = [
  { id: "gr-001", activity: "Door-to-Door Household Survey", date: "2024-08-20", location: "Ward 1, Gandhi Nagar", volunteer: "Amrit Pal", participantCount: 32, notes: "Good response from residents. 32 households visited, 28 surveys completed.", issuesRaised: "2 households reported water supply issues", followupRequired: true, status: "Submitted" as const },
  { id: "gr-002", activity: "Community Meeting - Water Supply", date: "2024-08-22", location: "Community Center", volunteer: "Simran Kaur", participantCount: 85, notes: "Well-attended meeting. Key concerns around water pressure and timing.", issuesRaised: "Water pressure in Ward 2 and Ward 3 below acceptable levels", followupRequired: true, status: "Verified" as const },
  { id: "gr-003", activity: "Polling Station Verification", date: "2024-08-18", location: "PS 5, Kiratpur Sahib", volunteer: "Jagdeep Singh", participantCount: 0, notes: "Verification completed. 3 discrepancies found in records.", issuesRaised: "Record mismatch for 3 entries", followupRequired: false, status: "Verified" as const },
  { id: "gr-004", activity: "Volunteer Training Session", date: "2024-08-15", location: "Nangal Township Office", volunteer: "Priya Sharma", participantCount: 8, notes: "6 out of 8 volunteers completed training. 2 need follow-up session.", issuesRaised: "None", followupRequired: true, status: "Rejected" as const },
];

export const mockIssues = [
  { id: "iss-001", reportedBy: "Amrit Pal", area: "Anandpur Sahib Urban", ward: "Ward 1", pollingStation: "PS 1", category: "Water" as const, description: "Low water pressure in Gandhi Nagar during morning hours", priority: "High" as const, dateReported: "2024-08-18", assignedTo: "Rajinder Singh", status: "In Progress" as const, resolution: null },
  { id: "iss-002", reportedBy: "Jagdeep Singh", area: "Kiratpur Sahib", ward: "Ward 4", pollingStation: "PS 5", category: "Roads" as const, description: "Large potholes on main approach road to Kiratpur market", priority: "Critical" as const, dateReported: "2024-08-15", assignedTo: "Gurmeet Kaur", status: "Assigned" as const, resolution: null },
  { id: "iss-003", reportedBy: "Priya Sharma", area: "Balachaur", ward: "Ward 6", pollingStation: "PS 8", category: "Electricity" as const, description: "Frequent power cuts in evening hours lasting 2-3 hours", priority: "High" as const, dateReported: "2024-08-10", assignedTo: "Mandeep Brar", status: "Pending" as const, resolution: null },
  { id: "iss-004", reportedBy: "Kulwant Bedi", area: "Anandpur Sahib Urban", ward: "Ward 2", pollingStation: "PS 2", category: "Sanitation" as const, description: "Overflowing drain near Station Road junction", priority: "Medium" as const, dateReported: "2024-08-05", assignedTo: "Rajinder Singh", status: "Resolved" as const, resolution: "Drain cleaned and blockage removed by municipal team on Aug 8" },
  { id: "iss-005", reportedBy: "Simran Kaur", area: "Anandpur Sahib Urban", ward: "Ward 3", pollingStation: "PS 3", category: "Education" as const, description: "Government school needs additional teachers for senior classes", priority: "Medium" as const, dateReported: "2024-08-01", assignedTo: "Rajinder Singh", status: "New" as const, resolution: null },
  { id: "iss-006", reportedBy: "Navneet Dhaliwal", area: "Nangal Township", ward: "Ward 5", pollingStation: "PS 7", category: "Healthcare" as const, description: "Primary health center lacks essential medicines", priority: "High" as const, dateReported: "2024-07-28", assignedTo: "Harpreet Gill", status: "Closed" as const, resolution: "Medicines supplied by health department on Aug 2" },
];

export const mockNotifications = [
  { id: "notif-001", type: "Activity Reminder" as const, title: "Activity starting tomorrow", message: "Door-to-Door Household Survey in Ward 1 starts tomorrow at 9:00 AM", time: "2 hours ago", read: false },
  { id: "notif-002", type: "Report Submitted" as const, title: "New ground report submitted", message: "Amrit Pal submitted a ground report for the household survey activity", time: "3 hours ago", read: false },
  { id: "notif-003", type: "Issue Escalation" as const, title: "Critical issue reported", message: "Road potholes on Kiratpur market approach road marked as critical", time: "5 hours ago", read: false },
  { id: "notif-004", type: "Verification Request" as const, title: "Report awaiting verification", message: "Ground report for Volunteer Training Session needs your verification", time: "1 day ago", read: true },
  { id: "notif-005", type: "Assignment Update" as const, title: "New activity assigned", message: "You have been assigned to Healthcare Camp Coordination on Aug 28", time: "1 day ago", read: true },
  { id: "notif-006", type: "Overdue Task" as const, title: "Activity overdue", message: "Data Entry Audit - Ward 3 is past its deadline", time: "2 days ago", read: true },
  { id: "notif-007", type: "Approval Request" as const, title: "Activity pending approval", message: "Road Infrastructure Assessment draft needs your approval", time: "2 days ago", read: false },
];

// ─── Dashboard Stats ────────────────────────────────────────────────────────────

export const mockDashboardStats = {
  totalRecords: 48750,
  totalHouseholds: 12430,
  totalAreas: 8,
  totalPollingStations: 142,
  teamLeaders: 18,
  volunteers: 92,
  activeUsers: 78,
  completedActivities: 156,
  pendingActivities: 34,
  overdueActivities: 8,
  reportedIssues: 89,
  resolvedIssues: 62,
  householdCoverage: 68,
  reportingCompliance: 82,
};

// ─── Chart Data ─────────────────────────────────────────────────────────────────

export const areaPerformanceData = mockAreas
  .filter((a) => a.status === "Active")
  .map((a) => ({
    name: a.code,
    fullName: a.name,
    activities: Math.floor(Math.random() * 30 + 10),
    households: a.householdCoverage,
    issues: Math.floor(Math.random() * 15 + 2),
  }));

export const activityCompletionData = [
  { name: "Completed", value: 156, color: "#10b981" },
  { name: "In Progress", value: 22, color: "#f59e0b" },
  { name: "Pending", value: 34, color: "#6366f1" },
  { name: "Overdue", value: 8, color: "#ef4444" },
];

export const monthlyActivityData = [
  { month: "Mar", completed: 18, pending: 5, overdue: 1 },
  { month: "Apr", completed: 24, pending: 8, overdue: 2 },
  { month: "May", completed: 28, pending: 6, overdue: 1 },
  { month: "Jun", completed: 32, pending: 10, overdue: 3 },
  { month: "Jul", completed: 30, pending: 12, overdue: 4 },
  { month: "Aug", completed: 24, pending: 14, overdue: 5 },
];

export const issueResolutionData = [
  { month: "Mar", reported: 8, resolved: 6 },
  { month: "Apr", reported: 12, resolved: 10 },
  { month: "May", reported: 15, resolved: 11 },
  { month: "Jun", reported: 18, resolved: 14 },
  { month: "Jul", reported: 20, resolved: 16 },
  { month: "Aug", reported: 16, resolved: 12 },
];

export const volunteerActivityData = [
  { month: "Mar", active: 45, inactive: 12 },
  { month: "Apr", active: 52, inactive: 10 },
  { month: "May", active: 60, inactive: 15 },
  { month: "Jun", active: 68, inactive: 12 },
  { month: "Jul", active: 74, inactive: 18 },
  { month: "Aug", active: 78, inactive: 14 },
];

// ─── Academy Data ───────────────────────────────────────────────────────────────

export const mockCourses = [
  { id: "course-001", title: "Volunteer Onboarding", description: "Complete guide for new volunteers covering data collection, reporting, and safety protocols", duration: "2 hours", modules: 6, progress: 100, status: "Completed" as const },
  { id: "course-002", title: "Household Survey Techniques", description: "Learn effective door-to-door survey methods and data quality practices", duration: "1.5 hours", modules: 4, progress: 60, status: "In Progress" as const },
  { id: "course-003", title: "Community Engagement", description: "Best practices for organizing and managing community meetings and events", duration: "3 hours", modules: 8, progress: 25, status: "In Progress" as const },
  { id: "course-004", title: "Data Entry & Validation", description: "Standards for accurate data entry, validation rules, and error correction", duration: "1 hour", modules: 3, progress: 0, status: "Not Started" as const },
  { id: "course-005", title: "Issue Reporting & Escalation", description: "How to properly document, categorize, and escalate constituency issues", duration: "45 min", modules: 2, progress: 0, status: "Not Started" as const },
];

// ─── Documents Data ─────────────────────────────────────────────────────────────

export const mockDocuments = [
  { id: "doc-001", name: "Volunteer Handbook 2024", category: "Training", type: "PDF", size: "2.4 MB", uploadedBy: "Admin", uploadedDate: "2024-06-01", accessLevel: "All" },
  { id: "doc-002", name: "Constituency Map - Official", category: "Maps", type: "PDF", size: "8.1 MB", uploadedBy: "Admin", uploadedDate: "2024-05-15", accessLevel: "Area Manager+" },
  { id: "doc-003", name: "Activity Report Template", category: "Templates", type: "DOCX", size: "156 KB", uploadedBy: "Admin", uploadedDate: "2024-07-01", accessLevel: "All" },
  { id: "doc-004", name: "Data Collection Guidelines", category: "Guidelines", type: "PDF", size: "1.2 MB", uploadedBy: "Admin", uploadedDate: "2024-04-20", accessLevel: "All" },
  { id: "doc-005", name: "Monthly Performance Report - July", category: "Reports", type: "PDF", size: "3.6 MB", uploadedBy: "Rajinder Singh", uploadedDate: "2024-08-01", accessLevel: "Admin Only" },
];
