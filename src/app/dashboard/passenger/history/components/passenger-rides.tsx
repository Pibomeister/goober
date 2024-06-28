import RideCard from '@/components/ride-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent } from '@/components/ui/card';
import { RideWithDriver } from '@/models/ride';
import React from 'react';

const PassengerRides = ({ rides }: { rides: RideWithDriver[] }) => {
  return (
    <ul className="list-none p-0  space-y-4">
      {rides.map((ride) => (
        <RideCard key={ride.id} ride={ride}>
          <CardContent>
            {ride?.driver && (
              <div className="flex justify-start items-center gap-2 w-min p-2 bg-muted border border-gray-200 rounded">
                <Avatar>
                  <AvatarImage
                    src={ride.driver?.user.imageUrl ?? ''}
                    alt={ride.driver?.user.name ?? ''}
                    width={50}
                    height={50}
                  />
                  <AvatarFallback>{ride.driver?.user.name}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-500">
                  {ride.driver?.user.name}
                </p>
              </div>
            )}
          </CardContent>
        </RideCard>
      ))}
    </ul>
  );
};

export default PassengerRides;
