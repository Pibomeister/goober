'use client';

import { doc, getFirestore } from '@firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';

import { riderFetchRide } from '@/actions/ride-actions';
import Map from '@/components/map';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import app from '@/lib/firebase';
import { RideWithRider } from '@/models/ride';
import { RideStatus } from '@prisma/client';
import { RideTimeline } from './ride-timeline';

const RidingContent = () => {
  const [ride, setRide] = useState<RideWithRider>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const searchParams = useSearchParams();
  const router = useRouter();
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
    handleResize();
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

  useEffect(() => {
    if (
      combinedData?.status === RideStatus.CANCELLED ||
      combinedData?.status === RideStatus.COMPLETED
    ) {
      // In a full version of the app, we'd send them back to search for a new driver.
      // For now, we'll just redirect them to the ride details page.
      router.push(`/dashboard/passenger/ride/${rideId}`);
      setTimeout(() => {
        alert(
          combinedData?.status === RideStatus.CANCELLED
            ? 'Ride cancelled'
            : 'Ride completed'
        );
      }, 1000);
    }
  }, [combinedData?.status, rideId, router]);
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
            <CardTitle>Your Ride</CardTitle>
            <CardDescription>
              Be sure to respect your driver and local laws and regulations
              while riding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RideTimeline ride={combinedData ?? {}} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RidingContent;
