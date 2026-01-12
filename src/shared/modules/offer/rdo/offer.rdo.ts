import { Expose, Type } from 'class-transformer';

import { Amenity, HousingType } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

class Coordinates {
  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;
}

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public city: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public createdAt: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: HousingType;

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public price: number;

  @Expose()
  public amenities: Amenity[];

  @Expose()
  public commentCount: number;

  @Expose()
  @Type(() => Coordinates)
  public location: Coordinates;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user: UserRdo;
}
