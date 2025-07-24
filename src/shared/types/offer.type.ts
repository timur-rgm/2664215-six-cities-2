export type Amenity =
  | 'Breakfast'
  | 'Air conditioning'
  | 'Laptop friendly workspace'
  | 'Baby seat'
  | 'Washer'
  | 'Towels'
  | 'Fridge';

export type City = 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';

export type Coordinates = {
  latitude: number;
  longitude: number;
}

export type HousingType = 'apartment' | 'house' | 'room' | 'hotel';

export type OfferType = {
  title: string;
  description: string;
  createdAt: string;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: Amenity[];
  host: string;
  commentCount: number;
  location: Coordinates;
}
