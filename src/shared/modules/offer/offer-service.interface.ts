import type { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';

export interface OfferService {
  createOffer(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findFavorite(): Promise<DocumentType<OfferEntity>[] | null>;
  findPremium(): Promise<DocumentType<OfferEntity>[] | null>;
  updateById(offerId: string, offerData: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): void;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
