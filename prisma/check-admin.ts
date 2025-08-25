import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

async function main() {
  const adminEmail = 'admin@example.com'; 

  console.log('Searching for admin user...');
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (adminUser) {
    console.log('✅ Admin user found:');
    console.log(adminUser);
  } else {
    console.log('⚠️ Admin user not found. Please run the seeding script first.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });