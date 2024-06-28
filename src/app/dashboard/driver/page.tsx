'use client';

import DriverContent from '@/app/dashboard/driver/components/driver-content';
import { Suspense } from 'react';

function Page() {
  return (
    <Suspense>
      <DriverContent />
    </Suspense>
  );
}

export default Page;
