import { Suspense } from 'react';

import DriverRidingContent from '@/app/dashboard/driver/riding/components/driver-riding-content';

function Page() {
  return (
    <Suspense>
      <DriverRidingContent />
    </Suspense>
  );
}

export default Page;
