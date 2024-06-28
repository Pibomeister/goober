'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { calculateFareBasedOnDistanceAndTime } from '@/lib/price';
import { RideStatus } from '@prisma/client';
import { addData, updateData } from '@/lib/firebase/methods';
import { driverUser } from '@/lib/constants';
import { LatLng } from '@/models/lat-lng';
import { RideWithRider } from '@/models/ride';
import { getTestDriver, getTestUser } from '@/actions/user-actions';

export async function listAvailableRides() {
  try {
    const availableRides = await db.ride.findMany({
      where: {
        status: 'REQUESTED',
      },
      include: {
        rider: {
          select: {
            name: true,
          },
        },
      },
    });
    return availableRides;
  } catch (error) {
    console.error('Failed to list available rides:', error);
    throw new Error('Failed to list available rides');
  }
}

export async function requestRide(
  pickupLocation: LatLng,
  dropoffLocation: LatLng,
  pickupAddress: string,
  dropoffAddress: string,
  distance: number,
  time: number
) {
  try {
    // In a full blown app this would be done with an auth framework like next auth
    const user = await getTestUser();
    const estimatedFare = calculateFareBasedOnDistanceAndTime(distance, time);
    const newRide = await db.ride.create({
      data: {
        riderId: user.id,
        status: RideStatus.REQUESTED,
        pickupLatitude: pickupLocation.lat,
        pickupLongitude: pickupLocation.lng,
        dropoffLatitude: dropoffLocation.lat,
        dropoffLongitude: dropoffLocation.lng,
        dropoffAddress,
        pickupAddress,
        distance,
        duration: time,
        estimatedFare,
        startTime: new Date(), // This is the server side time
      },
    });
    await addData('trips', newRide.id, {
      id: newRide.id,
      riderId: user.id,
      status: RideStatus.REQUESTED,
      pickupAddress,
      dropoffAddress,
      estimatedFare,
      pickupLocation,
      dropoffLocation,
      distance,
      duration: time,
      createdAt: newRide.createdAt,
      rider: {
        name: user.name,
        imageUrl: user.imageUrl,
      },
    });
    revalidatePath('/rides');
    return { ride: newRide };
  } catch (error) {
    console.error('Failed to start ride:', error);
    throw new Error('Failed to start ride');
  }
}

export async function riderFetchRide(rideId: string): Promise<RideWithRider> {
  const ride = await db.ride.findUniqueOrThrow({
    where: { id: rideId },
    include: {
      rider: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });
  return ride;
}

export async function driverFetchRide(rideId: string) {
  const ride = await db.ride.findUniqueOrThrow({
    where: { id: rideId },
    include: {
      rider: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
      completedDriver: true,
    },
  });
  return ride;
}

export async function acceptRide(rideId: string) {
  try {
    // Here we would check out auth to get the driver's name
    const driver = await getTestDriver();
    const driverName = driver.name;
    const driverImage = driver.imageUrl;
    const driverId = driver.driver?.id;

    const updatedRide = await db.ride.update({
      where: { id: rideId },
      data: {
        driverId,
        status: 'ACCEPTED',
        startTime: new Date(),
      },
    });
    await updateData('trips', rideId, {
      status: RideStatus.ACCEPTED,
      driverId,
      driverName,
      driverImage,
      startTime: new Date(),
    });

    revalidatePath('/rides');
    return updatedRide;
  } catch (error) {
    console.error('Failed to accept ride:', error);
    throw new Error('Failed to accept ride');
  }
}

export async function cancelRide(rideId: string) {
  const driver = await getTestDriver();
  const completedDriverId = driver.driver?.id;
  // In a complete app we could handle other drivers picking up this ride
  await db.ride.update({
    where: { id: rideId },
    data: {
      status: RideStatus.CANCELLED,
      endTime: new Date(),
      completedDriverId,
      driverId: null,
    },
  });
  await updateData('trips', rideId, {
    status: RideStatus.CANCELLED,
    endTime: new Date(),
  });
}

export async function startRide(rideId: string) {
  await db.ride.update({
    where: { id: rideId },
    data: {
      status: RideStatus.IN_PROGRESS,
    },
  });
  await updateData('trips', rideId, {
    status: RideStatus.IN_PROGRESS,
  });
}

export async function viewPreviousRides(
  userId: string,
  userRole: 'RIDER' | 'DRIVER'
) {
  try {
    const rides = await db.ride.findMany({
      where:
        userRole === 'RIDER'
          ? { riderId: userId, status: 'COMPLETED' }
          : { completedDriverId: userId, status: 'COMPLETED' },
      include: {
        rider: {
          select: { name: true },
        },
        completedDriver: {
          select: { user: { select: { name: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return rides;
  } catch (error) {
    console.error('Failed to view previous rides:', error);
    throw new Error('Failed to view previous rides');
  }
}

export async function fetchPendingRides() {
  const rides = await db.ride.findMany({
    where: { status: RideStatus.REQUESTED },
    include: {
      rider: {
        select: { name: true, imageUrl: true },
      },
    },
  });
  return rides;
}

export async function completeRide(rideId: string) {
  const ride = await db.ride.findUniqueOrThrow({
    where: { id: rideId },
  });
  // In a full blown app we would check that the ride belongs to the driver etc
  const elapsedTime =
    new Date().getTime() - (ride.startTime || ride.createdAt).getTime();
  const millisecondsInAMinute = 60_000;
  const elapsedTimeInMinutes = elapsedTime / millisecondsInAMinute;
  const actualFare = calculateFareBasedOnDistanceAndTime(
    ride.distance,
    elapsedTimeInMinutes
  );
  const driver = await getTestDriver();
  const driverId = driver.driver?.id;
  try {
    const completedRide = await db.ride.update({
      where: { id: rideId },
      data: {
        status: RideStatus.COMPLETED,
        actualFare,
        completedDriverId: driverId,
        driverId: null,
      },
    });
    await updateData('trips', rideId, {
      status: RideStatus.COMPLETED,
      actualFare,
      completedDriverId: driverId,
    });
    revalidatePath('/rides');
    return completedRide;
  } catch (error) {
    console.error('Failed to complete ride:', error);
    throw new Error('Failed to complete ride');
  }
}

export async function rateRide(rideId: string, rating: number) {
  // In a full blown app we would check that the ride belongs to the user etc
  try {
    const ratedRide = await db.ride.update({
      where: { id: rideId },
      data: {
        rating,
      },
    });
    await updateData('trips', rideId, {
      rating,
    });
    revalidatePath('/rides');
    return ratedRide;
  } catch (error) {
    console.error('Failed to rate ride:', error);
    throw new Error('Failed to rate ride');
  }
}
