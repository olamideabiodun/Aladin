import { PrismaClient, Role } from '@prisma/client';
import prisma from '@/lib/prisma';

async function main() {
  const adminEmail = 'admin1@example.com';
  const Password = 'admin123'; 

  console.log('Checking for existing admin user...');
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: Password,
        role: Role.ADMIN,
      },
    });
    console.log(`✅ Admin user created with email: ${adminEmail}`);
  } else {
    console.log(`⚠️ Admin user with email: ${adminEmail} already exists. No new user created.`);
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