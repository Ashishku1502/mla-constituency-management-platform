const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database with demo data...');

  // 1. Create Constituency
  const constituency = await prisma.constituency.create({
    data: {
      name: 'Central District',
      state: 'State',
      code: 'CD-01',
      population: 500000,
      totalAreas: 4,
      totalPollingStations: 120,
      totalHouseholds: 85000,
      registeredVoters: 250000,
      wards: 12,
      villages: 8,
      localities: 45,
    }
  });

  // 2. Create Area
  const area1 = await prisma.area.create({
    data: {
      name: 'Downtown Central',
      code: 'DTC-1',
      population: 120000,
      householdCoverage: 80,
      constituencyId: constituency.id,
      registeredVoters: 75000,
      status: 'Active'
    }
  });

  const area2 = await prisma.area.create({
    data: {
      name: 'Westside Valley',
      code: 'WSV-2',
      population: 95000,
      householdCoverage: 65,
      constituencyId: constituency.id,
      registeredVoters: 60000,
      status: 'Active'
    }
  });

  // 3. Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Michael Chang',
      email: 'michael.chang@demo.com',
      mobile: '9876543210',
      passwordHash: 'dummyhash',
      status: 'Active',
      role: 'Team Leader',
    }
  });

  const tl1 = await prisma.teamLeader.create({
    data: {
      userId: user1.id,
      areaId: area1.id,
    }
  });

  // 4. Create Polling Stations
  await prisma.pollingStation.create({
    data: {
      number: 1,
      name: 'City Hall Main Auditorium',
      address: '100 Main St, Center City',
      location: '31.23, 76.54',
      areaId: area1.id,
      teamLeaderId: tl1.id,
      voterCount: 1500,
      voterListStatus: 'Uploaded',
      status: 'Validated'
    }
  });

  await prisma.pollingStation.create({
    data: {
      number: 2,
      name: 'Community Center Library',
      address: '450 Oak Ave, Center City',
      location: '31.24, 76.55',
      areaId: area1.id,
      voterCount: 1200,
      voterListStatus: 'Pending',
      status: 'Pending'
    }
  });

  await prisma.pollingStation.create({
    data: {
      number: 3,
      name: 'Westside High School Gym',
      address: '1200 School Blvd',
      location: '31.20, 76.50',
      areaId: area2.id,
      voterCount: 1450,
      voterListStatus: 'Error',
      status: 'Error'
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
