import StaggeredDotsAnimation from '@/components/ui/staggered-dots-animation';
import { convertFirebaseTimestampToDate } from '@/lib/firebase/dates';
import { Timestamp } from '@firebase/firestore';
import { RideStatus } from '@prisma/client';
import { format } from 'date-fns';
import {
  CarIcon,
  CheckCircleIcon,
  CheckIcon,
  FlagIcon,
  MapPinIcon,
} from 'lucide-react';
import React from 'react';

export type TimelineRide = Partial<{
  id: string;
  status: RideStatus;
  createdAt: Date;
  updatedAt?: Date;
  startTime?: Date | null;
  endTime?: Date | null;
}>;

type TimelineEvent = {
  id: number;
  content: string;
  icon: React.ElementType;
  iconBackground: string;
  datetime: Date;
  component?: React.ElementType;
};

const getDriverTimelineEvents = (ride: TimelineRide): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    {
      id: 1,
      content: 'Ride accepted',
      icon: CheckIcon,
      iconBackground: 'bg-green-500',
      datetime: new Date(
        convertFirebaseTimestampToDate(
          ride.createdAt as unknown as Timestamp
        ) || new Date()
      ),
    },
    {
      id: 2,
      content: 'En route to pickup',
      icon: CarIcon,
      iconBackground: 'bg-blue-500',
      datetime: new Date(
        convertFirebaseTimestampToDate(
          ride.updatedAt as unknown as Timestamp
        ) || new Date()
      ),
    },
  ];

  if (
    ride.status === 'ACCEPTED' ||
    ride.status === 'IN_PROGRESS' ||
    ride.status === 'COMPLETED'
  ) {
    events.push({
      id: 3,
      content: 'Arriving at pickup location',
      icon: MapPinIcon,
      iconBackground: 'bg-yellow-500',
      datetime: new Date(
        convertFirebaseTimestampToDate(
          ride.updatedAt as unknown as Timestamp
        ) || new Date()
      ),
    });
  }

  if (ride.status === 'IN_PROGRESS' || ride.status === 'COMPLETED') {
    events.push({
      id: 4,
      content: 'Ride in progress',
      icon: FlagIcon,
      iconBackground: 'bg-indigo-500',
      datetime: new Date(
        convertFirebaseTimestampToDate(
          ride.startTime as unknown as Timestamp
        ) || new Date()
      ),
    });
  }

  if (ride.status === 'COMPLETED') {
    events.push({
      id: 5,
      content: 'Trip completed',
      icon: CheckCircleIcon,
      iconBackground: 'bg-green-500',
      datetime: new Date(
        convertFirebaseTimestampToDate(ride.endTime as unknown as Timestamp) ||
          new Date()
      ),
    });
  }

  // Add StaggeredDotsAnimation to the last incomplete event
  const lastIncompleteIndex =
    events.findIndex((event) => event.content === 'Trip completed') - 1;
  if (lastIncompleteIndex >= 0) {
    events[lastIncompleteIndex].component = StaggeredDotsAnimation;
  } else {
    events[events.length - 1].component = StaggeredDotsAnimation;
  }

  return events;
};

export const RideDriverTimeline: React.FC<{ ride: TimelineRide }> = ({
  ride,
}) => {
  const timeline = getDriverTimelineEvents(ride);

  return (
    <ul role="list" className="-mb-8">
      {timeline.map((event, eventIdx) => {
        const isCompleted =
          eventIdx !== timeline.length - 1 || ride.status === 'COMPLETED';
        const IconComponent = event.icon;
        const iconBackground = isCompleted
          ? 'bg-green-500'
          : event.iconBackground;

        return (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`${iconBackground} flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white`}
                  >
                    <IconComponent
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {event.content}
                      {event.component && <event.component />}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {format(event.datetime, 'hh:mm a')}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
