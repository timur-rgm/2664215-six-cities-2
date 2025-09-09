import { Amenity, City, Coordinates, HousingType, OfferType, UserRole } from '../types/index.js';

const parseBoolean = (value: string): boolean => value === 'true';
const parseNumber = (value: string): number => Number.parseInt(value, 10);
const parseArray = (value: string): string[] => value.split(';');

const parseLocation = (value: string): Coordinates => {
  const [latitude, longitude] = parseArray(value);
  return {
    latitude: parseNumber(latitude),
    longitude: parseNumber(longitude),
  };
};

export const createOffer = (offerData: string): OfferType => {
  const [
    title,
    description,
    createdAt,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    bedrooms,
    maxAdults,
    price,
    amenities,
    user,
    commentCount,
    location
  ] = offerData
    .replace('\n', '')
    .split('\t');

  const [name, email, role] = parseArray(user);

  return {
    title,
    description,
    createdAt: new Date(createdAt),
    previewImage,
    user: {
      name,
      email,
      type: role as UserRole
    },
    city: city as City,
    type: type as HousingType,
    images: parseArray(images),
    isPremium: parseBoolean(isPremium),
    isFavorite: parseBoolean(isFavorite),
    rating: parseNumber(rating),
    bedrooms: parseNumber(bedrooms),
    maxAdults: parseNumber(maxAdults),
    price: parseNumber(price),
    commentCount: parseNumber(commentCount),
    location: parseLocation(location),
    amenities: parseArray(amenities) as Amenity[],
  };
};
