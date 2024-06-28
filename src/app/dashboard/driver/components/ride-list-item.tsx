'use client';

import { acceptRide } from '@/actions/ride-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { convertFirebaseTimestampToDate } from '@/lib/firebase/dates';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowDownToDot,
  ArrowUpFromDot,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const RideListItem = ({ ride }: { ride: Record<string, any> }) => {
  const router = useRouter();
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={ride.rider?.imageUrl ?? ''}
              alt={ride.rider?.name}
            />
            <AvatarFallback>{ride.rider?.name?.[0] ?? ''}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold leading-6 text-primary">
              {ride.rider?.name}
            </h2>
            <span className="text-sm text-muted-foreground">
              {ride.createdAt &&
                formatDistanceToNow(
                  convertFirebaseTimestampToDate(ride.createdAt)
                )}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ArrowUpFromDot className="h-4 w-4 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Pickup</p>
            <p className="text-xs text-muted-foreground">
              {ride.pickupAddress}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownToDot className="h-4 w-4 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Dropoff</p>
            <p className="text-xs text-muted-foreground">
              {ride.dropoffAddress}
            </p>
          </div>
        </div>
      </div>
    </>
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <li className="relative flex flex-col space-y-4 py-6 px-6 hover:bg-muted/10 transition-all rounded-lg border border-muted mb-4 cursor-pointer">
          {content}
          <Separator />

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                ${ride.estimatedFare.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {Math.ceil(ride.duration)} mins
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Distance:</span>
              <span className="font-medium">
                {ride.distance?.toFixed(2)} km
              </span>
            </div>
          </div>
        </li>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Ride</DialogTitle>
          <DialogDescription>
            Are you sure you want to accept this ride?
          </DialogDescription>
        </DialogHeader>
        <div className="border rounded p-2 bg-muted">{content}</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                acceptRide(ride.id).then(() => {
                  router.push(`/dashboard/driver/riding?rideId=${ride.id}`);
                });
              }}
            >
              Accept
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
