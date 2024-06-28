'use client';

import { requestRide } from '@/actions/ride-actions';
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
import { calculateFareBasedOnDistanceAndTime } from '@/lib/price';
import { Loader2Icon, TicketCheckIcon, TicketXIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConfigureRide, { KickOffData } from './components/configure-ride';

type RequestState = 'configure' | 'directions' | 'confirmation' | 'success';

function Page() {
  const [state, setState] = useState<RequestState>('configure');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [locationInfo, setLocationInfo] = useState<KickOffData | null>(null);
  const [rideEstimate, setRideEstimate] = useState<number | null>(null);
  const [rideDistance, setRideDistance] = useState<number | null>(null);
  const [rideDuration, setRideDuration] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const showMap = state === 'directions' || state === 'confirmation';
  const onConfigRide = (data: KickOffData) => {
    setLocationInfo(data);
    setState('directions');
  };
  const onCancelRide = () => {
    setState('configure');
    setLocationInfo(null);
    setRideEstimate(null);
    setRideDistance(null);
    setRideDuration(null);
  };
  const onGetRideEstimate = (durationMinutes: number, distanceKm: number) => {
    if (durationMinutes == 0 || distanceKm == 0) {
      setState('configure');
      alert('Sorry unable to calculate estimate, please try again.');
      return;
    }
    const estimate = calculateFareBasedOnDistanceAndTime(
      durationMinutes,
      distanceKm
    );
    setRideEstimate(estimate);
    setRideDistance(distanceKm);
    setRideDuration(durationMinutes);
    setState('confirmation');
  };

  const onRequestRide = () => {
    requestRide(
      locationInfo!.pickupLatLng,
      locationInfo!.destinationLatLng!,
      locationInfo!.pickupAddress,
      locationInfo!.destinationAddress,
      rideDistance!,
      rideDuration!
    )
      .then(({ ride }) => {
        setState('success');
        router.push(`/dashboard/passenger/riding?rideId=${ride.id}`);
      })
      .catch((error) => {
        alert('Sorry unable to request ride, please try again.');
        setState('configure');
      })
      .finally(() => {
        setLoading(false);
      });
  };
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

  return (
    <main className="wrapper h-screen w-full relative overflow-hidden">
      <div className="flex items-center">
        {state === 'configure' && <ConfigureRide onKickoff={onConfigRide} />}
        {showMap && locationInfo && (
          <Map
            {...dimensions}
            start={locationInfo.pickupLatLng}
            end={locationInfo.destinationLatLng!}
            onDirectionChange={(directions) => {
              if (
                directions &&
                directions.routes.length > 0 &&
                directions.routes[0].legs.length > 0
              ) {
                const leg = directions.routes[0].legs[0];
                const distanceM = leg.distance?.value ?? 0;
                const durationS = leg.duration?.value ?? 0;
                const distanceKm = distanceM / 1000;
                const durationMin = durationS / 60;
                onGetRideEstimate(durationMin, distanceKm);
              } else {
                alert('Sorry unable to calculate estimate, please try again.');
                setState('configure');
              }
            }}
          />
        )}
        {state === 'confirmation' && (
          <Card className="absolute bottom-4 left-4 bg-white/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Your Ride Details</CardTitle>
              <CardDescription>
                Decide whether you want to start your ride.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Distance</span>
                <span className="font-semibold">
                  {rideDistance?.toFixed(2)} km
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-semibold">
                  {Math.ceil(rideDuration || 0)} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimate</span>
                <span className="font-semibold">
                  ${rideEstimate?.toFixed(2)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                className="flex-1"
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  onRequestRide();
                }}
              >
                {loading ? (
                  <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <>
                    <TicketCheckIcon className="h-4 w-4 mr-1" />
                    Confirm
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  onCancelRide();
                }}
              >
                <TicketXIcon className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}

export default Page;
