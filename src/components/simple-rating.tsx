import { Star, StarHalf } from 'lucide-react';

export const SimpleRating = ({ rating }: { rating: number }) => {
  const starVariant =
    rating >= 4 ? (
      <Star className="h-4 w-4 fill-current" />
    ) : (
      <StarHalf className="h-4 w-4 fill-current" />
    );
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {starVariant}
      <span>{Number.isInteger(rating) ? rating : rating.toFixed(2)}</span>
    </div>
  );
};
