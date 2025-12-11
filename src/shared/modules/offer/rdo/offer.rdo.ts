import { Expose } from 'class-transformer';

export class OfferRdo {
  @Expose()
    id: string;

  @Expose()
    title: string;

  @Expose()
    description: string;

  @Expose()
    city: string;
}
