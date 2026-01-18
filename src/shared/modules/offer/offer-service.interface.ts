import type { DocumentType } from '@typegoose/typegoose';

import { City, type DocumentExists } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferEntityWithIsFavorite } from './types/offer-entity-with-favorite.type.js';

export interface OfferService extends DocumentExists {
  addToFavorites(
    offerId: string,
    userId: string
  ): Promise<OfferEntityWithIsFavorite | null>;
  createOffer(
    offerData: CreateOfferDto,
    userId: string
  ): Promise<DocumentType<OfferEntity>>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  existsByTitle(title: string): Promise<boolean>;
  findAll(
    city?: City,
    isPremium?: boolean,
    isFavorite?: boolean,
    userId?: string
  ): Promise<OfferEntity[]>;
  findById(
    offerId: string,
    userId: string
  ): Promise<OfferEntityWithIsFavorite | null>;
  removeFromFavorites(
    offerId: string,
    userId: string
  ): Promise<OfferEntityWithIsFavorite | null>;
  updateById(
    offerId: string,
    offerData: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null>;
  updateRating(offerId: string, rating: number): Promise<void>;
}
