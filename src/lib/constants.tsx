import { RideWithDriver } from '@/models/ride';
import {
  CalendarIcon,
  CarIcon,
  MapIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

export const navigation = [
  { name: 'User Profile', href: '/dashboard/passenger', icon: UserIcon },
  { name: 'Driver Profile', href: '/dashboard/driver', icon: CarIcon },
  { name: 'Request Ride', href: '/dashboard/passenger/request', icon: MapIcon },
  {
    name: 'Ride History',
    href: '/dashboard/passenger/history',
    icon: CalendarIcon,
  },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
];

/**
 * Passenger user for testing, this wouldn't be needed in a real world application
 */
export const passengerUser = {
  id: 'passenger1',
  name: 'John Doe',
  role: 'Passenger',
  imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
};

/**
 * Driver user for testing, this wouldn't be needed in a real world application
 */
export const driverUser = {
  id: 'driver1',
  name: 'Jimmy Page',
  role: 'Driver',
  imageUrl: 'https://randomuser.me/api/portraits/men/18.jpg',
};

/**
 * Passenger stats for testing, this wouldn't be needed in a real world application
 */
export const passengerStats = [
  { label: 'Total Rides', value: '10' },
  { label: 'Total Trips', value: '20' },
  { label: 'Total Distance', value: '300' },
];

/**
 * Passenger rides for testing, this wouldn't be needed in a real world application
 */
export const passengerRides: RideWithDriver[] = [
  {
    id: '1',
    riderId: 'rider1',
    driverId: 'driver1',
    completedDriverId: 'driver1',
    status: 'COMPLETED',
    pickupAddress: '123 Main St, City A',
    dropoffAddress: '456 Elm St, City B',
    pickupLatitude: 40.712776,
    pickupLongitude: -74.005974,
    dropoffLatitude: 40.73061,
    dropoffLongitude: -73.935242,
    startTime: new Date('2023-01-01T10:00:00Z'),
    endTime: new Date('2023-01-01T11:00:00Z'),
    estimatedFare: 25.5,
    distance: 100,
    duration: 100,
    actualFare: 27.0,
    rating: 5,
    driver: {
      id: 'driver1',
      userId: 'user1',
      user: {
        id: 'user1',
        name: 'Jimmy Page',
        imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
    },
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T11:00:00Z'),
  },
  {
    id: '2',
    riderId: 'rider2',
    driverId: 'driver2',
    completedDriverId: 'driver2',
    status: 'COMPLETED',
    pickupAddress: '789 Oak St, City C',
    dropoffAddress: '101 Pine St, City D',
    pickupLatitude: 34.052235,
    pickupLongitude: -118.243683,
    dropoffLatitude: 34.052235,
    dropoffLongitude: -118.243683,
    estimatedFare: 15.75,
    distance: 100,
    duration: 100,
    actualFare: 16.0,
    startTime: new Date('2023-02-01T12:00:00Z'),
    endTime: new Date('2023-02-01T12:30:00Z'),
    rating: 4,
    driver: {
      id: 'driver5',
      userId: 'user5',
      user: {
        id: 'user5',
        name: 'Jane Doe',
        imageUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
      },
    },
    createdAt: new Date('2023-02-01T12:00:00Z'),
    updatedAt: new Date('2023-02-01T12:30:00Z'),
  },
  {
    id: '3',
    riderId: 'rider3',
    driverId: 'driver3',
    completedDriverId: 'driver3',
    status: 'CANCELLED',
    pickupAddress: '202 Birch St, City E',
    dropoffAddress: '303 Cedar St, City F',
    pickupLatitude: 37.774929,
    pickupLongitude: -122.419418,
    dropoffLatitude: 37.774929,
    dropoffLongitude: -122.419418,
    estimatedFare: 20.0,
    distance: 100,
    duration: 100,
    actualFare: null,
    rating: null,
    createdAt: new Date('2023-03-01T14:00:00Z'),
    updatedAt: new Date('2023-03-01T14:15:00Z'),
    startTime: new Date('2023-03-01T14:00:00Z'),
    endTime: new Date('2023-03-01T14:15:00Z'),
  },
  {
    id: '4',
    riderId: 'rider4',
    driverId: 'driver4',
    completedDriverId: 'driver4',
    status: 'IN_PROGRESS',
    pickupAddress: '404 Maple St, City G',
    dropoffAddress: '505 Walnut St, City H',
    pickupLatitude: 51.507351,
    pickupLongitude: -0.127758,
    dropoffLatitude: 51.507351,
    dropoffLongitude: -0.127758,
    estimatedFare: 30.0,
    distance: 100,
    duration: 100,
    actualFare: null,
    rating: null,
    driver: {
      id: 'driver6',
      userId: 'user6',
      user: {
        id: 'user6',
        name: 'Alice Smith',
        imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
      },
    },
    createdAt: new Date('2023-04-01T16:00:00Z'),
    updatedAt: new Date('2023-04-01T16:30:00Z'),
    startTime: new Date('2023-04-01T16:00:00Z'),
    endTime: null,
  },
  {
    id: '5',
    riderId: 'rider5',
    driverId: 'driver5',
    completedDriverId: 'driver5',
    status: 'REQUESTED',
    pickupAddress: '606 Spruce St, City I',
    dropoffAddress: '707 Fir St, City J',
    pickupLatitude: 48.856613,
    pickupLongitude: 2.352222,
    dropoffLatitude: 48.856613,
    dropoffLongitude: 2.352222,
    estimatedFare: 22.5,
    distance: 100,
    duration: 100,
    actualFare: null,
    rating: null,
    createdAt: new Date('2023-05-01T18:00:00Z'),
    updatedAt: new Date('2023-05-01T18:15:00Z'),
    startTime: null,
    endTime: null,
  },
];

/**
 * Goober constants that define pricing
 */
export const GOOBER_CUT_PERSENTAGE = 0.15;
export const GOOBER_BASE_FARE = 4;
export const GOOBER_PRICE_PER_KM = 0.8;
export const GOOBER_PRICE_PER_MINUTE = 0.2;
