import { inject, injectable } from 'inversify';
import type { DocumentType } from '@typegoose/typegoose';

import { Component, type ModelType } from '../../types/index.js';
import type { FavoriteService } from './favorite-service.interface.js';
import type { FavoriteEntity } from './favorite.entity.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: ModelType<FavoriteEntity>
  ) {}

  public async addFavorite(
    userId: string,
    offerId: string
  ): Promise<void> {
    await this.favoriteModel.updateOne(
      { userId, offerId },
      { $setOnInsert: { userId, offerId } },
      { upsert: true }
    ).exec();
  }

  public async exists(
    userId: string,
    offerId: string
  ): Promise<boolean> {
    return await this.favoriteModel.exists({ userId, offerId }) !== null;
  }

  public async findByUserId(
    userId: string
  ): Promise<DocumentType<FavoriteEntity>[]> {
    return this.favoriteModel.find({ userId }).exec();
  }

  public async removeByOfferId(offerId: string): Promise<void> {
    await this.favoriteModel.deleteMany({ offerId }).exec();
  }

  public async removeFavorite(
    userId: string,
    offerId: string
  ): Promise<void> {
    await this.favoriteModel.deleteOne({ userId, offerId }).exec();
  }
}
