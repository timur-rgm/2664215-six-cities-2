import { inject, injectable } from 'inversify';
import { Types, type PipelineStage } from 'mongoose';
import type { DocumentType } from '@typegoose/typegoose';

import { City, Component, type ModelType, } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import type { FavoriteService } from '../favorite/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferEntityWithIsFavorite } from './types/offer-entity-with-favorite.type.js';
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
  ): Promise<OfferEntityWithIsFavorite | null> {
    await this.favoriteService.addFavorite(userId, offerId);
    return this.findById(offerId, userId);
  }

  public async createOffer(
    offerData: CreateOfferDto,
    userId: string
  ): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({ ...offerData, userId });
    this.logger.info(`New offer created: ${offerData.title}`);
    return result;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.favoriteService.removeByOfferId(offerId);
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

  public async findAll(
    city?: City,
    isPremium?: boolean,
    isFavorite?: boolean,
    userId?: string
  ): Promise<OfferEntityWithIsFavorite[]> {
    const filterOffers = (): PipelineStage => ({
      $match: {
        ...(city && { city }),
        ...(isPremium !== undefined && { isPremium }),
      }
    });

    const attachComments = (): PipelineStage => ({
      $lookup: {
        from: 'comments',
        let: { offerId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
          { $project: { _id: 1}}
        ],
        as: 'comments',
      }
    });

    const attachUser = (): PipelineStage => ({
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userId'
      }
    });

    const flattenUser = (): PipelineStage => ({
      $unwind: '$userId'
    });

    const addComputedFields = (): PipelineStage => ({
      $addFields: {
        id: { $toString: '$_id'},
        commentCount: { $size: '$comments'}
      }
    });

    const attachFavorites = (): PipelineStage => ({
      $lookup: {
        from: 'favorites',
        localField: '_id',
        foreignField: 'offerId',
        as: 'favorites'
      }
    });

    const addIsFavoriteField = (): PipelineStage => ({
      $addFields: {
        isFavorite: userId
          ? { $in: [new Types.ObjectId(userId), '$favorites.userId'] }
          : false
      }
    });

    const filterByFavorites = (): PipelineStage => ({
      $match: { isFavorite: true }
    });

    const removeCommentsField = (): PipelineStage => ({
      $unset: 'comments'
    });

    const removeFavoritesField = (): PipelineStage => ({
      $unset: 'favorites'
    });

    const pipeline: PipelineStage[] = [
      filterOffers(),
      attachComments(),
      attachUser(),
      flattenUser(),
      addComputedFields(),
    ];

    if (userId) {
      pipeline.push(
        attachFavorites(),
      );
    }

    pipeline.push(addIsFavoriteField());

    if (isFavorite === true) {
      if (!userId) {
        return [];
      }

      pipeline.push(filterByFavorites());
    }

    pipeline.push(removeCommentsField());

    if (userId) {
      pipeline.push(removeFavoritesField());
    }

    return this.offerModel
      .aggregate<OfferEntityWithIsFavorite>(pipeline)
      .exec();
  }

  public async findById(
    offerId: string,
    userId?: string
  ): Promise<OfferEntityWithIsFavorite | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .lean()
      .exec();

    console.log({offer});

    if (!offer) {
      return null;
    }

    if (!userId) {
      return {
        ...offer,
        id: offer._id.toString(),
        isFavorite: false
      };
    }

    const isFavorite = await this.favoriteService.exists(
      userId,
      offerId
    );

    return {
      ...offer,
      id: offer._id.toString(),
      isFavorite
    };
  }

  public async removeFromFavorites(
    offerId: string,
    userId: string,
  ): Promise<OfferEntityWithIsFavorite | null> {
    await this.favoriteService.removeFavorite(userId, offerId);
    return this.findById(offerId, userId);
  }

  public async updateById(
    offerId: string,
    offerData: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndUpdate(offerId, offerData, { new: true })
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
