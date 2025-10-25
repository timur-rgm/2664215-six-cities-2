import type { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/index.js';

export interface OfferService {
  createOffer(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
