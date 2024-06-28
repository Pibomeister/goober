const { PrismaClient, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create a driver user
  const driverUser = await prisma.user.create({
    data: {
      email: 'driver@example.com',
      name: 'John Driver',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: UserRole.DRIVER,
      driver: {
        create: {
          isAvailable: true,
        },
      },
    },
  });

  console.log('Created driver user:', driverUser);

  // Create a rider user
  const riderUser = await prisma.user.create({
    data: {
      email: 'rider@example.com',
      name: 'Jane Rider',
      imageUrl: 'https://randomuser.me/api/portraits/men/91.jpg',
      role: UserRole.RIDER,
    },
  });

  console.log('Created rider user:', riderUser);

  // You can add more seed data here if needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
