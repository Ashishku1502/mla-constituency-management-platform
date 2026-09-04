const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log('Database connected successfully! Total users in local DB:', users.length);
}
main()
  .catch(e => {
    console.error('Database connection failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
