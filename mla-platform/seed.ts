import { prisma } from './src/lib/prisma';

async function main() {
  // Clear existing data to prevent duplicates on multiple runs
  await prisma.issue.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.household.deleteMany();
  await prisma.pollingStation.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.teamLeader.deleteMany();
  await prisma.areaManager.deleteMany();
  await prisma.area.deleteMany();
  await prisma.constituency.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating seed data...');

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'password123', // In a real app, this should be hashed
      role: 'Admin',
      mobile: '1234567890'
    }
  });

  const constituency = await prisma.constituency.create({
    data: {
      name: 'Central District',
      code: 'CD-01',
      state: 'StateName',
      population: 500000,
      registeredVoters: 150000,
    }
  });

  const area = await prisma.area.create({
    data: {
      name: 'Downtown Ward',
      code: 'DW-01',
      population: 100000,
      constituencyId: constituency.id,
    }
  });

  const pollingStation = await prisma.pollingStation.create({
    data: {
      number: 1,
      name: 'City Hall Station',
      address: '100 Main St',
      areaId: area.id,
    }
  });

  const teamLeaderUser = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: 'password123',
      role: 'Team Leader',
      mobile: '0987654321'
    }
  });

  const teamLeader = await prisma.teamLeader.create({
    data: {
      userId: teamLeaderUser.id,
      areaId: area.id,
    }
  });

  const volunteerUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: 'password123',
      role: 'Volunteer',
      mobile: '5555555555'
    }
  });

  const volunteer = await prisma.volunteer.create({
    data: {
      userId: volunteerUser.id,
      areaId: area.id,
      pollingStationId: pollingStation.id,
    }
  });

  console.log('✅ Seeding complete! Test data has been added to the database.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
