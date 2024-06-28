import {
  GOOBER_CUT_PERSENTAGE,
  GOOBER_PRICE_PER_KM,
  GOOBER_PRICE_PER_MINUTE,
} from '@/lib/constants';

/**
 * Calculates the fare based on distance and time
 * @param distance in meters
 * @param time in minutes
 * @param demandMultiplier
 * @param pricePerKm
 * @param pricePerMinute
 * @returns
 */
export const calculateFareBasedOnDistanceAndTime = (
  distance: number,
  time: number,
  demandMultiplier = 1.0, // In the future this could account for demand based surge pricing
  pricePerKm = GOOBER_PRICE_PER_KM, // This could be retrieved from an external API
  pricePerMinute = GOOBER_PRICE_PER_MINUTE // This could be retrieved from an external API
) => {
  const price = distance * pricePerKm + time * pricePerMinute;
  return price * demandMultiplier;
};

/**
 * Calculates the driver cut from the price
 * @param price
 * @returns
 */
export const getDriverCutFromPrice = (price: number) => {
  const gooberCut = price * GOOBER_CUT_PERSENTAGE;
  const driverCut = price - gooberCut;
  return driverCut;
};
