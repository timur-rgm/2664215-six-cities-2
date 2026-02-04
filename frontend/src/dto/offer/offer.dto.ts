import type { Amenity, City, HousingType } from './offer.emums';

class CoordinatesDto {
  public latitude!: number;
  public longitude!: number;
}

export class OfferDto {
  public id!: string;
  public title!: string;
  public description!: string;
  public city!: City;
  public previewImage!: string;
  public createdAt!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: HousingType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public amenities!: Amenity[];
  public commentCount!: number;
  public location!: CoordinatesDto;
  public user!: unknown;
}
