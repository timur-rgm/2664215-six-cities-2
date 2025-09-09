import type { Amenity, City, Coordinates, HousingType } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: HousingType;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public amenities: Amenity[];
  public userId: string;
  public commentCount: number;
  public location: Coordinates;
}
