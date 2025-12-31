import type { DocumentType } from '@typegoose/typegoose';

import { City, type DocumentExists } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import type { OfferEntity } from './offer.entity.js';

export interface OfferService extends DocumentExists {
  findAll(
    city?: City,
    isPremium?: boolean,
    isFavorite?: boolean
  ): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity>>;
  findAllFavorites(): Promise<DocumentType<OfferEntity>[]>;
  createOffer(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(offerId: string, offerData: UpdateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateRating(offerId: string, rating: number): Promise<void>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  setIsFavorite(offerId: string, isFavorite: boolean): Promise<DocumentType<OfferEntity>>;
}
