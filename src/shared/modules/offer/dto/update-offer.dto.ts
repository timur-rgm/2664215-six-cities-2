import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray, IsBoolean,
  IsEnum, IsInt, IsNumber,
  IsOptional, IsString, Max,
  MaxLength, Min,
  MinLength, ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import { UpdateOfferValidationMessage } from './update-offer.validation.messages.js';
import { Amenity, City, HousingType, } from '../../../types/index.js';

class Coordinates {
  @IsNumber({},{
    message: UpdateOfferValidationMessage.location.type
  })
  public latitude: number;

  @IsNumber({},{
    message: UpdateOfferValidationMessage.location.type
  })
  public longitude: number;
}

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {
    message: UpdateOfferValidationMessage.title.minLength
  })
  @MaxLength(100, {
    message: UpdateOfferValidationMessage.title.maxLength
  })
  public title?: string;

  @IsOptional()
  @MinLength(20, {
    message: UpdateOfferValidationMessage.description.minLength
  })
  @MaxLength(1024, {
    message: UpdateOfferValidationMessage.description.maxLength
  })
  public description?: string;

  @IsOptional()
  @IsEnum(City, {
    message: UpdateOfferValidationMessage.city.type
  })
  public city?: City;

  @IsOptional()
  @IsString({
    message: UpdateOfferValidationMessage.previewImage.type
  })
  public previewImage?: string;

  @IsOptional()
  @IsArray({
    message: UpdateOfferValidationMessage.images.type
  })
  @ArrayMinSize(6, {
    message: UpdateOfferValidationMessage.images.count
  })
  @ArrayMaxSize(6, {
    message: UpdateOfferValidationMessage.images.count
  })
  @IsString({
    each: true,
    message: UpdateOfferValidationMessage.images.itemType
  })
  public images?: string[];

  @IsOptional()
  @IsBoolean({
    message: UpdateOfferValidationMessage.isPremium.type
  })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, {
    message: UpdateOfferValidationMessage.type.type
  })
  public type?: HousingType;

  @IsOptional()
  @IsInt({
    message: UpdateOfferValidationMessage.bedrooms.type
  })
  @Min(1, {
    message: UpdateOfferValidationMessage.bedrooms.minValue
  })
  @Max(8, {
    message: UpdateOfferValidationMessage.bedrooms.maxValue
  })
  public bedrooms?: number;

  @IsOptional()
  @IsInt({
    message: UpdateOfferValidationMessage.maxAdults.type
  })
  @Min(1, {
    message: UpdateOfferValidationMessage.maxAdults.minValue
  })
  @Max(10, {
    message: UpdateOfferValidationMessage.maxAdults.maxValue
  })
  public maxAdults?: number;

  @IsOptional()
  @IsInt({
    message: UpdateOfferValidationMessage.price.type
  })
  @Min(100, {
    message: UpdateOfferValidationMessage.price.minValue
  })
  @Max(100_000, {
    message: UpdateOfferValidationMessage.price.maxValue
  })
  public price?: number;

  @IsOptional()
  @IsArray({
    message: UpdateOfferValidationMessage.amenities.type
  })
  @ArrayMinSize(1, {
    message: UpdateOfferValidationMessage.amenities.minItems
  })
  @IsEnum(Amenity, {
    each: true,
    message: UpdateOfferValidationMessage.amenities.itemType
  })
  public amenities?: Amenity[];

  @IsOptional()
  @ValidateNested()
  @Type(() => Coordinates)
  public location?: Coordinates;
}
