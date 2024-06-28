'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { Checkbox } from '@/components/ui/checkbox';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js';
import { getAddress, useCurrentLocation } from '@/hooks/use-current-location';
import { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider.js';
import { LatLng } from '@/models/lat-lng';

const SearchAddress = dynamic(() => import('@/components/ui/search-address'), {
  ssr: false,
});

export type KickOffData = {
  pickupAddress: string;
  pickupLatLng: LatLng;
  destinationAddress: string;
  destinationLatLng: LatLng;
};

interface ConfigureRideProps {
  onKickoff: (data: KickOffData) => void;
}

const ConfigureRide = ({ onKickoff }: ConfigureRideProps) => {
  const [useCurrentLocationForPickup, setUseCurrentLocationForPickup] =
    useState(true);
  const [pickup, setPickup] = useState<SearchResult<RawResult> | null>(null);
  const [destination, setDestination] =
    useState<SearchResult<RawResult> | null>(null);
  const { position, latLng } = useCurrentLocation();

  const onRequestRide = async () => {
    let pickupLatLng: LatLng;
    let pickupAddress: string;
    let destinationLatLng: LatLng;
    let destinationAddress: string;
    if (useCurrentLocationForPickup) {
      if (!latLng) return;
      pickupLatLng = latLng;
      pickupAddress = await getAddress(pickupLatLng);
    } else {
      if (!pickup) return;
      pickupLatLng = {
        lat: +(pickup.raw as any).lat,
        lng: +(pickup.raw as any).lon,
      };
      pickupAddress = (pickup.raw as any).display_name;
    }
    if (!destination) return;
    destinationLatLng = {
      lat: +(destination.raw as any).lat,
      lng: +(destination.raw as any).lon,
    };
    destinationAddress = (destination.raw as any).display_name;
    onKickoff({
      pickupLatLng,
      pickupAddress,
      destinationLatLng,
      destinationAddress,
    });
  };
  const waitingOnLocation = useCurrentLocationForPickup && !latLng;
  return (
    <div className="h-[calc(100vh-5rem)] w-full flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 flex-shrink-0">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Request a Ride</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Enter your destination
          </h3>
          <div className="mt-4 flex flex-col gap-4 justify-start">
            <div className="flex flex-col gap-2 justify-start">
              <Label className="text-start text-muted-foreground">
                Pick me up from
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={useCurrentLocationForPickup}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') {
                      setUseCurrentLocationForPickup(false);
                      return;
                    }
                    setUseCurrentLocationForPickup(checked);
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use current location
                </label>
              </div>
              {!useCurrentLocationForPickup && (
                <SearchAddress
                  onSelectLocation={(position) => {
                    setPickup(position);
                  }}
                />
              )}
            </div>
            <div className="flex flex-col gap-2 justify-start">
              <Label className="text-start text-muted-foreground">
                Take me to
              </Label>
              <SearchAddress
                onSelectLocation={(position) => {
                  setDestination(position);
                }}
              />
            </div>
            <Button
              disabled={!(!!pickup || !!position) || !destination}
              onClick={onRequestRide}
            >
              {waitingOnLocation ? 'Waiting on location...' : 'Search'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureRide;
