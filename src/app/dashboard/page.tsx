import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Request a Ride</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Enter your destination
          </h3>
          <p className="text-sm text-muted-foreground">
            We&apos;ll use your current location as the starting point.
          </p>
          <div className="mt-4 flex gap-2">
            <Input placeholder="Enter destination" />
            <Button>Search</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
