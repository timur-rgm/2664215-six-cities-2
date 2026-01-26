import type { UserType } from './user.type.js';

export enum Amenity {
  Breakfast = 'Breakfast',
  Air = 'Air conditioning',
  Laptop = 'Laptop friendly workspace',
  Baby = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export enum City {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

export enum HousingType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel'
}

export type Coordinates = {
  latitude: number;
  longitude: number;
}

export type OfferType = {
  title: string;
  description: string;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: Amenity[];
  user: UserType;
  commentCount: number;
  location: Coordinates;
  createdAt?: Date;
  updatedAt?: Date;
}
