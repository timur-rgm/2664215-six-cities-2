import type { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/index.js';

export interface OfferService {
  createOffer(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findByOfferName(offerName: string): Promise<DocumentType<OfferEntity> | null>;
  findByOfferNameOrCreate(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
}
