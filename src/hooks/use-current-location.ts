import { fromLatLng, geocode, RequestType, setKey } from 'react-geocode';
import { useEffect, useMemo, useRef, useState } from 'react';

import { LatLng } from '@/models/lat-lng';

const TEN_MINUTES = 1000 * 60 * 10;
const THERTY_SECONDS = 1000 * 30;

const getLastKnownLocation = async (): Promise<GeolocationPosition> => {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: false,
          maximumAge: TEN_MINUTES,
          timeout: THERTY_SECONDS,
        }
      );
    });
  } else {
    throw new Error('Geolocation is not supported by this browser.');
  }
};

export const getAddress = async (latLng: LatLng): Promise<string> => {
  setKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!);
  console.log(process.env.NE);
  const address = await fromLatLng(latLng.lat, latLng.lng);
  if (!address.results[0]) {
    throw new Error('No address found');
  }
  return address.results[0].formatted_address;
};

/**
 * @param polling - Whether to poll for the current location.
 * @param pollingInterval - The interval in milliseconds to poll for the current location.
 * @returns The current location and error.
 */
export const useCurrentLocation = (
  polling = false,
  pollingInterval = 10_000
) => {
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    getLastKnownLocation()
      .then((location) => {
        setPosition(location);
      })
      .catch((error) => {
        setError(error.message);
      });
    if (polling) {
      interval.current = setInterval(() => {
        getLastKnownLocation()
          .then((location) => {
            setPosition(location);
          })
          .catch((error) => {
            setError(error.message);
          });
      }, pollingInterval);
    }
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [polling, pollingInterval]);

  const latLng = useMemo(() => {
    if (!position) return null;
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }, [position]);

  const loading = useMemo(() => !position && !error, [position, error]);

  return { position, error, latLng, loading };
};
