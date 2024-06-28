import { CarTaxiFront } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import RidesList from './components/ride-list';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { passengerRides, passengerStats, passengerUser } from '@/lib/constants';

const user = passengerUser;
const stats = passengerStats;
const rides = passengerRides;

function Page() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="overflow-hidden rounded-lg bg-card shadow">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="bg-white p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5 items-center">
              <div className="flex-shrink-0">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.name}
                    width={50}
                    height={50}
                  />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">
                  Welcome back,
                </p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {user.name}
                </p>
                <p className="text-sm font-medium text-gray-600">{user.role}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
              <Link
                href="/dashboard/passenger/history"
                className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                View history
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-5 text-center text-sm font-medium"
            >
              <span className="text-gray-900">{stat.value}</span>{' '}
              <span className="text-gray-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Your Latest Rides</h2>
          <Button asChild>
            <Link href="/dashboard/passenger/request" className="flex">
              <CarTaxiFront className="w-4 h-4 mr-1" />
              Request a ride
            </Link>
          </Button>
        </div>
        <RidesList rides={rides} />
      </div>
    </main>
  );
}

export default Page;
