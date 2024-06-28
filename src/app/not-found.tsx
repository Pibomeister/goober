import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-secondary-foreground/80">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
          <Button variant="link" className="text-sm font-semibold ">
            <Link href="mailto:support@example.com">
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
