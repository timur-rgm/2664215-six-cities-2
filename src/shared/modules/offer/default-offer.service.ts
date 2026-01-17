import { inject, injectable } from 'inversify';
import type { DocumentType } from '@typegoose/typegoose';

import { City, Component, type ModelType } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import type { FavoriteService } from '../favorite/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.FavoriteService)
    private readonly favoriteService: FavoriteService,

    @inject(Component.Logger)
    private readonly logger: Logger,

    @inject(Component.OfferModel)
    private readonly offerModel: ModelType<OfferEntity>,
  ) {}

  public async addToFavorites(
    offerId: string,
    userId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    await this.favoriteService.addFavorite(userId, offerId);
    return this.findById(offerId);
  }

  public async createOffer(
    offerData: CreateOfferDto,
    userId: string
  ): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({ ...offerData, userId });
    this.logger.info(`New offer created: ${offerData.title}`);
    return result;
  }

  public deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    return await this.offerModel.exists({ _id: offerId }) !== null;
  }

  public async existsByTitle(title: string): Promise<boolean> {
    return await this.offerModel.exists({ title }) !== null;
  }

  public findAll(
    city?: City,
    isPremium?: boolean,
    isFavorite?: boolean,
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            ...(city && { city }),
            ...(isPremium !== undefined && { isPremium }),
            ...(isFavorite !== undefined && { isFavorite }),
          }
        },
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
              { $project: { _id: 1}}
            ],
            as: 'comments',
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId'
          }
        },
        {
          $unwind: '$userId'
        },
        { $addFields:
          { id: { $toString: '$_id'}, commentCount: { $size: '$comments'} }
        },
        { $unset: 'comments' },
      ])
      .exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();
  }

  public findAllFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ isFavorite: true })
      .populate(['userId'])
      .exec();
  }

  public async removeFromFavorites(
    offerId: string,
    userId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    await this.favoriteService.removeFavorite(userId, offerId);
    return this.findById(offerId);
  }

  public async updateById(
    offerId: string,
    offerData: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndUpdate(offerId, offerData, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async updateRating(
    offerId: string,
    rating: number
  ): Promise<void> {
    await this.offerModel
      .findByIdAndUpdate(offerId, { rating }, { new: true })
      .exec();
  }
}
