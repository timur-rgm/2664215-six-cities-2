import type { DocumentType } from '@typegoose/typegoose';
import type { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  addFavorite(userId: string, offerId: string): Promise<void>;
  removeByOfferId(offerId: string): Promise<void>;
  removeFavorite(userId: string, offerId: string): Promise<void>;
}
