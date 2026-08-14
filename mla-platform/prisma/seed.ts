import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mla_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing data in reverse order of dependencies
  await prisma.auditLog.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.issue.deleteMany({});
  await prisma.groundReport.deleteMany({});
  await prisma.activityAssignment.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.record.deleteMany({});
  await prisma.familyMember.deleteMany({});
  await prisma.household.deleteMany({});
  await prisma.pollingStation.deleteMany({});
  await prisma.ward.deleteMany({});
  await prisma.volunteer.deleteMany({});
  await prisma.teamLeader.deleteMany({});
  await prisma.areaManager.deleteMany({});
  await prisma.area.deleteMany({});
  await prisma.constituency.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.course.deleteMany({});

  // 1. Password Hashing
  const passwordHash = await bcrypt.hash("password123", 10);

  // 2. Users
  console.log("Creating default users...");
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@constituencyos.org",
      mobile: "9999999999",
      passwordHash,
      role: "Admin",
      status: "Active",
    },
  });

  const candidateUser = await prisma.user.create({
    data: {
      name: "S. Harpreet Singh",
      email: "candidate@constituencyos.org",
      mobile: "9888888888",
      passwordHash,
      role: "Candidate",
      status: "Active",
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: "Rajinder Singh",
      email: "rajinder@constituencyos.org",
      mobile: "98765xxxxx",
      passwordHash,
      role: "Area Manager",
      status: "Active",
    },
  });

  const leaderUser = await prisma.user.create({
    data: {
      name: "Balwinder Singh",
      email: "balwinder@constituencyos.org",
      mobile: "97651xxxxx",
      passwordHash,
      role: "Team Leader",
      status: "Active",
    },
  });

  const volunteerUser = await prisma.user.create({
    data: {
      name: "Amrit Pal",
      email: "amrit@constituencyos.org",
      mobile: "96541xxxxx",
      passwordHash,
      role: "Volunteer",
      status: "Active",
    },
  });

  // 3. Constituency
  console.log("Creating constituency...");
  const constituency = await prisma.constituency.create({
    data: {
      name: "Anandpur Sahib",
      state: "Punjab",
      code: "AC-042",
      population: 215000,
      totalAreas: 8,
      totalPollingStations: 142,
      totalHouseholds: 12430,
    },
  });

  // 4. Areas
  console.log("Creating constituency areas...");
  const areasData = [
    { name: "Anandpur Sahib Urban", code: "ASU-01", population: 42000, status: "Active", householdCoverage: 78 },
    { name: "Kiratpur Sahib", code: "KS-02", population: 38000, status: "Active", householdCoverage: 65 },
    { name: "Nangal Township", code: "NT-03", population: 35000, status: "Active", householdCoverage: 72 },
    { name: "Bhakra Dam Area", code: "BD-04", population: 22000, status: "Active", householdCoverage: 58 },
    { name: "Balachaur", code: "BL-05", population: 28000, status: "Active", householdCoverage: 62 },
    { name: "Ganguwal", code: "GW-06", population: 18000, status: "Active", householdCoverage: 55 },
    { name: "Takhtupura", code: "TK-07", population: 16000, status: "Inactive", householdCoverage: 42 },
    { name: "Mehatpur", code: "MH-08", population: 16000, status: "Active", householdCoverage: 48 },
  ];

  const areas: Record<string, any> = {};
  for (const a of areasData) {
    const area = await prisma.area.create({
      data: {
        ...a,
        constituencyId: constituency.id,
      },
    });
    areas[a.name] = area;
  }

  // 5. Manager Mappings
  await prisma.areaManager.create({
    data: {
      userId: managerUser.id,
      areaId: areas["Anandpur Sahib Urban"].id,
    },
  });

  // 6. Team Leader Mappings
  const teamLeader = await prisma.teamLeader.create({
    data: {
      userId: leaderUser.id,
      areaId: areas["Anandpur Sahib Urban"].id,
      pollingStations: "PS 1, PS 2",
    },
  });

  // 7. Wards
  const ward1 = await prisma.ward.create({
    data: {
      name: "Ward 1",
      type: "Ward",
      areaId: areas["Anandpur Sahib Urban"].id,
      population: 7500,
      households: 1850,
    },
  });

  // 8. Polling Stations
  const ps1 = await prisma.pollingStation.create({
    data: {
      number: 1,
      name: "Government Senior Secondary School",
      address: "Main Road, Anandpur Sahib",
      areaId: areas["Anandpur Sahib Urban"].id,
      teamLeaderId: teamLeader.id,
      recordCount: 520,
      status: "Validated",
    },
  });

  const ps2 = await prisma.pollingStation.create({
    data: {
      number: 2,
      name: "Primary School Hall",
      address: "Station Road, Anandpur Sahib",
      areaId: areas["Anandpur Sahib Urban"].id,
      teamLeaderId: teamLeader.id,
      recordCount: 485,
      status: "Validated",
    },
  });

  // 9. Volunteer Mappings
  const volunteer = await prisma.volunteer.create({
    data: {
      userId: volunteerUser.id,
      areaId: areas["Anandpur Sahib Urban"].id,
      pollingStationId: ps1.id,
      householdsCount: 42,
    },
  });

  // 10. Households
  const hh1 = await prisma.household.create({
    data: {
      houseNumber: "H-142",
      headOfHousehold: "Mohinder Singh",
      contact: "98765xxxxx",
      address: "42, Gandhi Nagar",
      locality: "Gandhi Nagar",
      pollingStationId: ps1.id,
      wardId: ward1.id,
      familyMembersCount: 5,
      verificationStatus: "Verified",
      assignedVolunteerId: volunteer.id,
    },
  });

  // 11. Family Members
  await prisma.familyMember.create({
    data: {
      name: "Gurpreet Kaur",
      age: 48,
      gender: "Female",
      relation: "Wife",
      householdId: hh1.id,
    },
  });

  // 12. Records
  await prisma.record.create({
    data: {
      name: "Mohinder Singh",
      voterId: "PB/06/042/001423",
      mobile: "98765xxxxx",
      address: "42, Gandhi Nagar, Anandpur Sahib",
      pollingStationId: ps1.id,
      householdId: hh1.id,
      validationStatus: "Validated",
    },
  });

  // 13. Activities
  const activity = await prisma.activity.create({
    data: {
      name: "Door-to-Door Household Survey",
      category: "Survey",
      description: "Complete household survey in Ward 1",
      objective: "Verify and update household information",
      date: "2024-08-20",
      startTime: "09:00",
      endTime: "17:00",
      location: "Ward 1, Gandhi Nagar",
      areaId: areas["Anandpur Sahib Urban"].id,
      pollingStationId: ps1.id,
      teamLeaderId: teamLeader.id,
      volunteersCount: 1,
      capacity: 6,
      status: "In Progress",
      deadline: "2024-08-25",
    },
  });

  // 14. Activity Assignment
  await prisma.activityAssignment.create({
    data: {
      activityId: activity.id,
      volunteerId: volunteer.id,
      status: "Accepted",
    },
  });

  // 15. Ground Report
  await prisma.groundReport.create({
    data: {
      activityId: activity.id,
      date: "2024-08-20",
      location: "Ward 1, Gandhi Nagar",
      volunteerId: volunteer.id,
      participantCount: 32,
      notes: "Good response from residents. 32 households visited, 28 surveys completed.",
      issuesRaised: "2 households reported water supply issues",
      followupRequired: true,
      status: "Submitted",
    },
  });

  // 16. Issues
  await prisma.issue.create({
    data: {
      reportedById: volunteerUser.id,
      areaId: areas["Anandpur Sahib Urban"].id,
      pollingStationId: ps1.id,
      category: "Water",
      description: "Low water pressure in Gandhi Nagar during morning hours",
      priority: "High",
      dateReported: "2024-08-18",
      assignedToId: managerUser.id,
      status: "In Progress",
    },
  });

  // 17. Academy Courses
  await prisma.course.create({
    data: {
      title: "Volunteer Onboarding",
      description: "Complete guide for new volunteers covering data collection, reporting, and safety protocols",
      duration: "2 hours",
      modulesCount: 6,
      progress: 100,
      status: "Completed",
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
