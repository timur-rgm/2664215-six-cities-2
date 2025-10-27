import type { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { City } from '../../types/index.js';

export interface OfferService {
  createOffer(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findAll(): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findAllFavorites(): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  updateById(offerId: string, offerData: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
