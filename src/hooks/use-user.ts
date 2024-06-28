import { getTestDriver, getTestUser } from '@/actions/user-actions';
import { User, UserRole } from '@prisma/client';
import { useEffect, useState } from 'react';

const useUser = (role: UserRole) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (role === UserRole.RIDER) {
      getTestUser().then(setUser);
    } else if (role === UserRole.DRIVER) {
      getTestDriver().then(setUser);
    }
  }, [role]);
  return user;
};

export default useUser;
