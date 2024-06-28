'use server';

import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const getTestUser = async () => {
  const user = await db.user.findFirst({
    where: {
      role: UserRole.RIDER,
    },
  });
  if (!user) {
    throw new Error('Test user not found, please run the seed script');
  }
  return user;
};

export const getTestDriver = async () => {
  const user = await db.user.findFirst({
    where: {
      role: UserRole.DRIVER,
    },
    include: {
      driver: true,
    },
  });
  if (!user) {
    throw new Error('Test driver not found, please run the seed script');
  }
  return user;
};
