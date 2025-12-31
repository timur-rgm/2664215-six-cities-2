import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  type Ref
} from '@typegoose/typegoose';

import { Amenity, City, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

class Coordinates {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, trim: true })
  public title: string;

  @prop({ required: true, trim: true })
  public description: string;

  @prop({
    required: true,
    type: () => String,
    enum: City
  })
  public city: City;

  @prop({ required: true })
  public previewImage: string;

  @prop({
    required: true,
    type: () => String
  })
  public images: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true })
  public isFavorite: boolean;

  @prop({
    min: 1,
    max: 5
  })
  public rating: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingType
  })
  public type: HousingType;

  @prop({
    required: true,
    min: 1,
    max: 8
  })
  public bedrooms: number;

  @prop({
    required: true,
    min: 1,
    max: 10
  })
  public maxAdults: number;

  @prop({
    required: true,
    min: 100,
    max: 100_000
  })
  public price: number;

  @prop({
    required: true,
    type: () => String,
    enum: Amenity
  })
  public amenities: Amenity[];

  @prop({
    ref: () => UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentCount: number;

  @prop({
    required: true,
    _id: false
  })
  public location: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
