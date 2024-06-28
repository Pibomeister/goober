import React from 'react';

import { Badge, badgeVariants } from '@/components/ui/badge';
import { RideStatus } from '@prisma/client';
import { VariantProps } from 'class-variance-authority';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2Icon,
} from 'lucide-react';

/**
 * Get the variant of the badge based on the status of the ride
 * @param status - The status of the ride
 * @returns The variant of the badge
 */
const getStatusVariant = (
  status: RideStatus
): VariantProps<typeof badgeVariants> => {
  switch (status) {
    case RideStatus.REQUESTED:
      return { variant: 'warning' };
    case RideStatus.ACCEPTED:
      return { variant: 'secondary' };
    case RideStatus.IN_PROGRESS:
      return { variant: 'outline' };
    case RideStatus.COMPLETED:
      return { variant: 'success' };
    case RideStatus.CANCELLED:
      return { variant: 'destructive' };
    default:
      return { variant: 'outline' };
  }
};

const getStatusIcon = (status: RideStatus) => {
  switch (status) {
    case RideStatus.REQUESTED:
      return <ClockIcon className="h-4 w-4" />;
    case RideStatus.ACCEPTED:
      return <CheckCircleIcon className="h-4 w-4" />;
    case RideStatus.IN_PROGRESS:
      return <Loader2Icon className="h-4 w-4 animate-spin" />;
    case RideStatus.COMPLETED:
      return <CheckCircleIcon className="h-4 w-4" />;
    case RideStatus.CANCELLED:
      return <XCircleIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
};

export const RideStatusBadge = ({ status }: { status: RideStatus }) => {
  return (
    <Badge {...getStatusVariant(status)} className="py-2">
      {getStatusIcon(status)} <span className="lowercase ml-1">{status}</span>
    </Badge>
  );
};
