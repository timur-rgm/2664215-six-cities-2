import { Amenity, City, HousingType } from "./offer.emums";

class Coordinates {
  public latitude!: number;
  public longitude!: number;
}

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city!: City;
  public isPremium!: boolean;
  public type!: HousingType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public amenities!: Amenity[];
  public location!: Coordinates;
}
