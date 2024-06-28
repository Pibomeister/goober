import { Suspense } from 'react';

import RidingContent from '@/app/dashboard/passenger/riding/components/riding-content';

function Page() {
  return (
    <Suspense>
      <RidingContent />
    </Suspense>
  );
}

export default Page;
