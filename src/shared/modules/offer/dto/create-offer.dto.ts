import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Amenity, City, HousingType } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.validation.messages.js';

class Coordinates {
  @IsNumber({},{
    message: CreateOfferValidationMessage.location.type
  })
  public latitude: number;

  @IsNumber({},{
    message: CreateOfferValidationMessage.location.type
  })
  public longitude: number;
}

export class CreateOfferDto {
  @MinLength(10, {
    message: CreateOfferValidationMessage.title.minLength
  })
  @MaxLength(100, {
    message: CreateOfferValidationMessage.title.maxLength
  })
  public title: string;

  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength
  })
  public description: string;

  @IsEnum(City, {
    message: CreateOfferValidationMessage.city.type
  })
  public city: City;

  @IsString({
    message: CreateOfferValidationMessage.previewImage.type
  })
  public previewImage: string;

  @IsArray({
    message: CreateOfferValidationMessage.images.type
  })
  @ArrayMinSize(6, {
    message: CreateOfferValidationMessage.images.count
  })
  @ArrayMaxSize(6, {
    message: CreateOfferValidationMessage.images.count
  })
  @IsString({
    each: true,
    message: CreateOfferValidationMessage.images.itemType
  })
  public images: string[];

  @IsBoolean({
    message: CreateOfferValidationMessage.isPremium.type
  })
  public isPremium: boolean;

  @IsBoolean({
    message: CreateOfferValidationMessage.isFavorite.type
  })
  public isFavorite: boolean;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: CreateOfferValidationMessage.rating.type }
  )
  @Min(0, {
    message: CreateOfferValidationMessage.rating.minValue
  })
  @Max(5, {
    message: CreateOfferValidationMessage.rating.maxValue
  })
  public rating: number;

  @IsEnum(HousingType, {
    message: CreateOfferValidationMessage.type.type
  })
  public type: HousingType;

  @IsInt({
    message: CreateOfferValidationMessage.bedrooms.type
  })
  @Min(1, {
    message: CreateOfferValidationMessage.bedrooms.minValue
  })
  @Min(8, {
    message: CreateOfferValidationMessage.bedrooms.maxValue
  })
  public bedrooms: number;

  @IsInt({
    message: CreateOfferValidationMessage.maxAdults.type
  })
  @Min(1, {
    message: CreateOfferValidationMessage.maxAdults.minValue
  })
  @Min(10, {
    message: CreateOfferValidationMessage.maxAdults.maxValue
  })
  public maxAdults: number;

  @IsInt({
    message: CreateOfferValidationMessage.price.type
  })
  @Min(100, {
    message: CreateOfferValidationMessage.price.minValue
  })
  @Min(100_000, {
    message: CreateOfferValidationMessage.price.maxValue
  })
  public price: number;

  @IsArray({
    message: CreateOfferValidationMessage.amenities.type
  })
  @ArrayMinSize(1, {
    message: CreateOfferValidationMessage.amenities.minItems
  })
  @IsEnum(Amenity, {
    each: true,
    message: CreateOfferValidationMessage.amenities.itemType
  })
  public amenities: Amenity[];

  @IsMongoId({
    message: CreateOfferValidationMessage.userId.id
  })
  public userId: string;

  @ValidateNested()
  @Type(() => Coordinates)
  public location: Coordinates;
}
