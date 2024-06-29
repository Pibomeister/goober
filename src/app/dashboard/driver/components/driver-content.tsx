'use client';

import { collection, getFirestore } from '@firebase/firestore';
import { InboxIcon, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useCollection } from 'react-firebase-hooks/firestore';
import useWindowSize from 'react-use/lib/useWindowSize';

import app from '@/lib/firebase';
import { RideStatus } from '@prisma/client';
import { RideListItem } from './ride-list-item';

const DriverContent = () => {
  const [data, loading, error] = useCollection(
    collection(getFirestore(app), 'trips'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const { width, height } = useWindowSize();

  const pendingRides = data?.docs.filter(
    (doc) => doc.data().status === RideStatus.REQUESTED
  );

  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        alert('Ride completed! Congratulations');
      }, 3000);
    } else if (isCancelled) {
      setTimeout(() => {
        alert('Ride cancelled!');
      }, 3000);
    }
  }, [isCompleted, isCancelled]);

  return (
    <>
      <main className="bg-muted/10 p-8">
        <div className="container flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Available Rides</h1>
          {loading && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          )}
          {!loading && (
            <>
              {pendingRides && pendingRides.length > 0 && (
                <ul>
                  {pendingRides.map((ride) => (
                    <RideListItem key={ride.id} ride={ride.data()} />
                  ))}
                </ul>
              )}
              {pendingRides?.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 min-h-64">
                  <h1 className="text-muted-foreground text-lg">
                    No pending rides
                  </h1>
                  <InboxIcon className="h-10 w-10" />
                  <p className="text-muted-foreground">
                    As soon as ride becomes available, it will appear here
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {isCompleted && (
        <Confetti width={width} height={height} recycle={false} />
      )}
    </>
  );
};

export default DriverContent;
