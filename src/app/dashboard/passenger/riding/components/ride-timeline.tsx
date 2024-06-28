import React from 'react';
import { format } from 'date-fns';
import { RideStatus } from '@prisma/client';
import {
  CheckCircleIcon,
  FlagIcon,
  MapPinIcon,
  UserIcon,
  CheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { convertFirebaseTimestampToDate } from '@/lib/firebase/dates';
import { Timestamp } from '@firebase/firestore';

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

const StaggeredDotsAnimation: React.FC = () => (
  <div className="flex space-x-1">
    <div
      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
      style={{ animationDelay: '0s' }}
    ></div>
    <div
      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
      style={{ animationDelay: '0.2s' }}
    ></div>
    <div
      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
      style={{ animationDelay: '0.4s' }}
    ></div>
  </div>
);

const getTimelineEvents = (ride: TimelineRide): TimelineEvent[] => {
  const baseEvents: TimelineEvent[] = [
    {
      id: 1,
      content: 'Ride requested',
      icon: MapPinIcon,
      iconBackground: 'bg-blue-500',
      datetime: new Date(
        convertFirebaseTimestampToDate(
          ride.createdAt as unknown as Timestamp
        ) || new Date()
      ),
    },
  ];

  let events = [...baseEvents];

  switch (ride.status) {
    case 'COMPLETED':
      events.push({
        id: 5,
        content: 'Trip completed',
        icon: CheckCircleIcon,
        iconBackground: 'bg-green-500',
        datetime: new Date(
          convertFirebaseTimestampToDate(
            ride.endTime as unknown as Timestamp
          ) || new Date()
        ),
      });
    case 'IN_PROGRESS':
      events.push({
        id: 4,
        content: 'Trip in progress',
        icon: FlagIcon,
        iconBackground: 'bg-yellow-500',
        datetime: new Date(
          convertFirebaseTimestampToDate(
            ride.startTime as unknown as Timestamp
          ) || new Date()
        ),
      });
    case 'ACCEPTED':
      events.push(
        {
          id: 2,
          content: 'Driver found',
          icon: UserIcon,
          iconBackground: 'bg-indigo-500',
          datetime: new Date(
            convertFirebaseTimestampToDate(
              ride.updatedAt as unknown as Timestamp
            ) || new Date()
          ),
        },
        {
          id: 3,
          content: 'Driver en route to pickup',
          icon: MapPinIcon,
          iconBackground: 'bg-indigo-500',
          datetime: new Date(
            convertFirebaseTimestampToDate(
              ride.updatedAt as unknown as Timestamp
            ) || new Date()
          ),
        }
      );
      break;
    case 'REQUESTED':
    default:
      events.push({
        id: 2,
        content: 'Looking for driver',
        icon: UserIcon,
        iconBackground: 'bg-gray-500',
        datetime: new Date(
          convertFirebaseTimestampToDate(
            ride.updatedAt as unknown as Timestamp
          ) || new Date()
        ),
      });
  }

  events = events.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  // Add StaggeredDotsAnimation to the last event
  events[events.length - 1].component = StaggeredDotsAnimation;

  return events;
};

export const RideTimeline: React.FC<{ ride: TimelineRide }> = ({ ride }) => {
  const timeline = getTimelineEvents(ride);

  return (
    <ul role="list" className="-mb-8">
      {timeline.map((event, eventIdx) => {
        const isCompleted = eventIdx !== timeline.length - 1;
        const IconComponent = isCompleted ? CheckIcon : event.icon;
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
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white',
                      iconBackground
                    )}
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
                    {event.datetime && format(event.datetime, 'hh:mm a')}
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
