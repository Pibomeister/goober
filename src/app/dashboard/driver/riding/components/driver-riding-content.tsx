'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  cancelRide,
  completeRide,
  riderFetchRide,
  startRide,
} from '@/actions/ride-actions';
import { RideDriverTimeline } from '@/app/dashboard/driver/riding/components/ride-driver-timeline';
import Map from '@/components/map';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import app from '@/lib/firebase';
import { RideWithRider } from '@/models/ride';
import { doc, getFirestore } from '@firebase/firestore';
import { RideStatus } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useDocument } from 'react-firebase-hooks/firestore';

const DriverRidingContent = () => {
  const router = useRouter();
  const [ride, setRide] = useState<RideWithRider>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const searchParams = useSearchParams();
  const rideId = searchParams.get('rideId');
  useEffect(() => {
    if (rideId) {
      riderFetchRide(rideId).then((ride) => {
        setRide(ride);
      });
    }
  }, [rideId]);

  const [value, loading, error] = useDocument(
    doc(getFirestore(app), 'trips', rideId!),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const handleResize = () => {
      const wrapper = document.querySelector('.wrapper');
      if (wrapper) {
        setDimensions({
          width: wrapper.clientWidth,
          height: wrapper.clientHeight,
        });
      }
    };
    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const combinedData = useMemo(() => {
    if (ride && value) {
      return { ...ride, ...value.data() };
    }
  }, [ride, value]);

  const pickupLocation = {
    lat: ride?.pickupLatitude!,
    lng: ride?.pickupLongitude!,
  };
  const dropoffLocation = {
    lat: ride?.dropoffLatitude!,
    lng: ride?.dropoffLongitude!,
  };

  const getAction = () => {
    if (combinedData?.status === RideStatus.ACCEPTED) {
      return (
        <CardFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              cancelRide(rideId!).then(() => {
                router.push('/dashboard/driver');
              });
            }}
          >
            Cancel Ride
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              startRide(rideId!).then(() => {
                router.refresh();
              });
            }}
          >
            Passenger picked up, start ride
          </Button>
        </CardFooter>
      );
    }
    if (combinedData?.status === RideStatus.IN_PROGRESS) {
      return (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              completeRide(rideId!).then(() => {
                router.push('/dashboard/driver?status=completed');
              });
            }}
          >
            Complete Ride
          </Button>
        </CardFooter>
      );
    }
    return <></>;
  };
  return (
    <div className="wrapper h-screen w-full relative">
      {ride && (
        <Map {...dimensions} start={pickupLocation} end={dropoffLocation} />
      )}
      {(!ride || loading) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}
      {ride && (
        <Card className="absolute bottom-4 left-4 bg-white/40 backdrop-blur-md max-w-md">
          <CardHeader>
            <CardTitle>Your drive</CardTitle>
            <CardDescription>
              Be sure to respect your passenger and local laws and regulations
              while driving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RideDriverTimeline ride={combinedData ?? {}} />
          </CardContent>
          {getAction()}
        </Card>
      )}
    </div>
  );
};

export default DriverRidingContent;
