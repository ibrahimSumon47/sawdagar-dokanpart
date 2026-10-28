/** Delivery zones used to price shipping from a seller's district. */
export const shippingZones = ['inside-dhaka', 'outside-dhaka', 'remote'] as const;

export type ShippingZone = (typeof shippingZones)[number];

/** Flat demo fee per seller shipment, in poisha. */
export const shippingRatesMinor: Record<ShippingZone, number> = {
  'inside-dhaka': 6_000,
  'outside-dhaka': 12_000,
  remote: 18_000,
};

/** Free delivery starts at ৳10,000 of goods, before shipping and discounts. */
export const FREE_DELIVERY_THRESHOLD_MINOR = 1_000_000;

/** Hill districts where the demo courier charges its remote rate. */
const remoteDistricts = new Set(['Bandarban', 'Khagrachhari', 'Rangamati']);

/** Maps a delivery district to the zone that prices its shipping. */
export function shippingZoneForDistrict(district: string): ShippingZone {
  if (remoteDistricts.has(district)) return 'remote';
  return district === 'Dhaka' ? 'inside-dhaka' : 'outside-dhaka';
}

/** The fee for one seller shipment to a zone. */
export function shippingFeeForZone(zone: ShippingZone): number {
  return shippingRatesMinor[zone];
}

/**
 * Charges one shipment per seller. Free delivery applies to the whole order,
 * so every seller's fee disappears once the goods subtotal reaches the
 * threshold.
 */
export function shippingMinorForOrder(
  subtotalMinor: number,
  sellerCount: number,
  destinationDistrict: string,
): number {
  if (subtotalMinor >= FREE_DELIVERY_THRESHOLD_MINOR) return 0;
  if (sellerCount <= 0) return 0;
  return shippingFeeForZone(shippingZoneForDistrict(destinationDistrict)) * sellerCount;
}
