import type { DocumentType } from '@typegoose/typegoose';
import type { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  addFavorite(userId: string, offerId: string): Promise<void>;
  exists(userId: string, offerId: string): Promise<boolean>;
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  removeByOfferId(offerId: string): Promise<void>;
  removeFavorite(userId: string, offerId: string): Promise<void>;
}
