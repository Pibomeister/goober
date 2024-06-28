import React from 'react';
import { RideStatusBadge } from '@/components/ride-status-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RideWithDriver } from '@/models/ride';
import { RideStatus } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

const statuses: Record<RideStatus, string> = {
  [RideStatus.REQUESTED]: 'text-warning-foreground bg-warning/10',
  [RideStatus.ACCEPTED]: 'text-success-foreground bg-success/10',
  [RideStatus.IN_PROGRESS]: 'text-primary-foreground bg-primary/10',
  [RideStatus.COMPLETED]: 'text-success-foreground bg-success/10',
  [RideStatus.CANCELLED]: 'text-destructive-foreground bg-destructive/10',
};

const statusCenters: Record<RideStatus, string> = {
  [RideStatus.REQUESTED]: 'bg-warning',
  [RideStatus.ACCEPTED]: 'bg-success',
  [RideStatus.IN_PROGRESS]: 'bg-primary',
  [RideStatus.COMPLETED]: 'bg-success',
  [RideStatus.CANCELLED]: 'bg-destructive',
};

type RideStatusDotProps = {
  status: RideStatus;
};

const RideStatusDot = ({ status }: RideStatusDotProps) => (
  <div className={cn(statuses[status], 'flex-none rounded-full p-1')}>
    <div
      className={cn('h-2 w-2 rounded-full bg-current', statusCenters[status])}
    />
  </div>
);

type RideDetailsProps = {
  ride: RideWithDriver;
};

const RideDetails = ({ ride }: RideDetailsProps) => (
  <div className="flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
    {ride.driver && <p className="truncate">{ride.driver.user.name}</p>}
    {ride.driver && ride.actualFare && (
      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
        <circle cx={1} cy={1} r={1} />
      </svg>
    )}
    <p className="whitespace-nowrap">
      {ride.actualFare ? `$${ride.actualFare.toFixed(2)}` : ''}
    </p>
  </div>
);

type RideInfoProps = {
  ride: RideWithDriver;
};

const RideInfo = ({ ride }: RideInfoProps) => (
  <div className="min-w-0 flex-auto flex flex-col justify-between">
    <div className="flex items-center gap-x-3">
      <RideStatusDot status={ride.status} />
      <h2 className="min-w-0 font-semibold leading-6 truncate">
        <Link href={`/ride/${ride.id}`} className="flex items-baseline gap-x-2">
          <span className="truncate">{ride.dropoffAddress}</span>
          <span className="whitespace-nowrap text-foreground/60 text-sm">
            {formatDistanceToNow(ride.createdAt)}
          </span>
        </Link>
      </h2>
    </div>
    <RideDetails ride={ride} />
  </div>
);

type RideListItemProps = {
  ride: RideWithDriver;
};

const RideListItem = ({ ride }: RideListItemProps) => (
  <li className="relative flex items-center space-x-4 py-4 px-4 hover:bg-muted/10 transition-all h-24">
    <RideInfo ride={ride} />
    <div className="flex items-center space-x-4">
      <RideStatusBadge status={ride.status} />
      <ChevronRightIcon
        className="h-5 w-5 flex-none text-gray-400"
        aria-hidden="true"
      />
    </div>
    <Link
      href={`/dashboard/passenger/ride/${ride.id}`}
      className="absolute inset-0"
    />
  </li>
);

const ViewAllButton = () => (
  <div className="flex justify-center items-center mt-4">
    <Button variant="outline" asChild>
      <Link href="/dashboard/passenger/history" className="min-w-md">
        View All
      </Link>
    </Button>
  </div>
);

type RidesListProps = {
  rides: RideWithDriver[];
};

const RidesList = ({ rides }: RidesListProps) => (
  <div>
    <ul className="list-none p-0 divide-y divide-gray-100">
      {rides.map((ride) => (
        <RideListItem key={ride.id} ride={ride} />
      ))}
    </ul>
    <ViewAllButton />
  </div>
);

export default RidesList;
