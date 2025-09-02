import type { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/index.js';

export interface OfferService {
  create(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findByCategoryId(id: string): Promise<DocumentType<OfferEntity> | null>;
  findByCategoryName(name: string): Promise<DocumentType<OfferEntity> | null>;
  findByCategoryNameOrCreate(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
}
