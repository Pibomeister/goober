import PassengerRides from './components/passenger-rides';
import React from 'react';

import { passengerRides } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { CarIcon } from 'lucide-react';
import Link from 'next/link';

const rides = passengerRides;

function Page() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ride History</h1>
        <Button asChild>
          <Link href="/dashboard/passenger/request" className="flex gap-1">
            <CarIcon className="w-4 h-4" />
            Request a ride
          </Link>
        </Button>
      </div>
      <div className="container py-4">
        <PassengerRides rides={rides} />
      </div>
    </div>
  );
}

export default Page;
