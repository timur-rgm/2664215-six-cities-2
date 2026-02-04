import type { NewOffer, Offer } from '../types/types';
import { Amenity, City, HousingType } from '../dto/offer/offer.emums';
import type { CreateOfferDto } from '../dto/offer/create-offer.dto';
import type { UpdateOfferDto } from '../dto/offer/update-offer.dto';

export const adaptCreateOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name as City,
  isPremium: offer.isPremium,
  type: offer.type as HousingType,
  bedrooms: offer.bedrooms,
  maxAdults: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods as Amenity[],
  location: offer.location,
});

export const adaptUpdateOfferToServer = (offer: Offer): UpdateOfferDto => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name as City,
  isPremium: offer.isPremium,
  type: offer.type as HousingType,
  bedrooms: offer.bedrooms,
  maxAdults: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods as Amenity[],
  location: offer.location,
  previewImage: offer.previewImage,
  images: offer.images,
});
