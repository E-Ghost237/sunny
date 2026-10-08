// Field names match the real, extracted store data exactly (see
// sunny/extract/extract_stores.py), sourced from each store page's
// schema.org/LocalBusiness JSON-LD.

export interface StoreAddress {
  streetAddress: string | null;
  addressLocality: string | null;
  addressRegion: string | null;
  postalCode: string | null;
  addressCountry: string | null;
}

export interface StoreHours {
  day: string;
  /** Both null when the store is closed that day. */
  opens: string | null;
  closes: string | null;
}

export interface StoreReview {
  author: string; // anonymized -- never the real reviewer's name
  rating: number | null;
  text: string | null;
}

export interface StoreCapabilities {
  recPickup: boolean;
  recDelivery: boolean;
  medPickup: boolean;
  medDelivery: boolean;
  recComingSoon: boolean;
  medComingSoon: boolean;
}

export interface StoreLocation {
  id?: string;
  slug: string;
  /** Back-office uploads; when a view is missing the default photo path is used. */
  photos?: Partial<Record<'exterior' | 'interior' | 'panorama', string>>;
  name: string;
  image: string;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  timezone: string | null;
  brands: string[];
  /** Short store description, shown in the store's About section. */
  description?: string;
  address: StoreAddress;
  openingHours: StoreHours[];
  capabilities: StoreCapabilities;
  aggregateRating: { ratingValue: number; reviewCount: number } | null;
  reviews: StoreReview[];
}
