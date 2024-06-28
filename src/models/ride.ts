import { LatLng } from '@/models/lat-lng';
import { Driver, Ride, RideStatus, User } from '@prisma/client';

export type RideWithDriver = Ride & {
  driver?: Pick<Driver, 'id' | 'userId'> & {
    user: Pick<User, 'id' | 'name' | 'imageUrl'>;
  };
};

export type RideWithRider = Ride & {
  rider?: Pick<User, 'name' | 'imageUrl'>;
};

export type Trip = {
  id: string;
  status: RideStatus;
  riderId: string;
  driverId: string;
  pickupLocation: LatLng;
  dropoffLocation: LatLng;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedFare: number;
  driverName: string;
  driverImage: string;
  riderName: string;
  riderImage: string;
  startTime: string;
  endTime: string;
};
