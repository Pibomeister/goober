import { formatDistanceToNow } from 'date-fns';
import {
  Clock,
  MapPin,
  DollarSign,
  ArrowUpFromDot,
  ArrowDownToDot,
} from 'lucide-react';
import React from 'react';

import { SimpleRating } from '@/components/simple-rating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Ride } from '@prisma/client';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { RideStatusBadge } from '@/components/ride-status-badge';

const RideCard = ({
  ride,
  children,
}: {
  ride: Ride;
  children?: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">
                {formatDistanceToNow(new Date(ride.createdAt))}
              </span>
            </div>
          </CardTitle>
          <RideStatusBadge status={ride.status} />
        </div>
      </CardHeader>
      {children}
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpFromDot className="h-4 w-4" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-xs text-muted-foreground">
                {ride.pickupAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownToDot className="h-4 w-4" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Dropoff</p>
              <p className="text-xs text-muted-foreground">
                {ride.dropoffAddress}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {ride.estimatedFare.toFixed(2)}
              </span>
            </div>
            {ride.rating && <SimpleRating rating={ride.rating} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
