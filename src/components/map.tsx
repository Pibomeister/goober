'use client';

import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  useJsApiLoader,
} from '@react-google-maps/api';
import { LatLng } from '@/models/lat-lng';

const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

interface MapProps {
  width: number;
  height: number;
  start: LatLng;
  end: LatLng;
  onDirectionChange?: (direction: google.maps.DirectionsResult) => void;
}

function Map({ width, height, start, end, onDirectionChange }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!,
  });

  const [mounted, setMounted] = useState(false);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );

  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (result !== null && status === 'OK') {
        setResponse(result);
        onDirectionChange?.(result);
      } else {
        console.error('Directions request failed:', status);
      }
    },
    [onDirectionChange]
  );

  const directionsServiceOptions =
    useMemo<google.maps.DirectionsRequest>(() => {
      return {
        destination: end,
        origin: start,
        travelMode: 'DRIVING' as const,
      } as unknown as google.maps.DirectionsRequest;
    }, [start, end]);

  const directionsResult = useMemo(() => {
    return {
      directions: response,
    };
  }, [response]);

  const mapCenter = useMemo<LatLng>(() => {
    return {
      lat: (start.lat + end.lat) / 2,
      lng: (start.lng + end.lng) / 2,
    };
  }, [start, end]);

  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(start.lat, start.lng),
        new window.google.maps.LatLng(end.lat, end.lng)
      );
      map.fitBounds(bounds);

      setMap(map);
    },
    [start, end]
  );

  useEffect(() => {
    if (map) {
      onLoad(map);
    }
  }, [map, onLoad]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const containerStyle = {
    width,
    height,
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return isLoaded ? (
    <Suspense>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <DirectionsService
          options={directionsServiceOptions}
          callback={directionsCallback}
        />
        {response && <DirectionsRenderer options={directionsResult} />}
      </GoogleMap>
    </Suspense>
  ) : (
    <></>
  );
}

export default memo(Map);
