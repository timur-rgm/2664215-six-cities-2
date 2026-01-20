import { inject, injectable } from 'inversify';
import type { DocumentType } from '@typegoose/typegoose';

import { addIsFavoriteToOffers } from './helpers/index.js';
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
    const filterOffers = () => ({
      $match: {
        ...(city && { city }),
        ...(isPremium !== undefined && { isPremium }),
      }
    });

    const attachComments = () => ({
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

    const attachUser = () => ({
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userId'
      }
    });

    const flattenUser = () => ({
      $unwind: '$userId'
    });

    const addComputedFields = () => ({
      $addFields: {
        id: { $toString: '$_id'},
        commentCount: { $size: '$comments'}
      }
    });

    const removeCommentsField = () => ({
      $unset: 'comments'
    });

    const offers = await this.offerModel
      .aggregate<OfferEntity>([
        filterOffers(),
        attachComments(),
        attachUser(),
        flattenUser(),
        addComputedFields(),
        removeCommentsField(),
      ])
      .exec();

    if (!userId) {
      if (isFavorite === true) {
        return [];
      }

      return offers.map((offer) => ({
        ...offer,
        isFavorite: false
      }));
    }

    const favorites = await this.favoriteService.findByUserId(userId);

    const offersWithIsFavorite = addIsFavoriteToOffers(
      offers,
      favorites,
    );

    if (isFavorite === true) {
      return offersWithIsFavorite.filter((offer) => offer.isFavorite);
    }

    return offersWithIsFavorite;
  }

  public async findById(
    offerId: string,
    userId?: string
  ): Promise<OfferEntityWithIsFavorite | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();

    if (!offer) {
      return null;
    }

    if (!userId) {
      return {
        ...offer,
        isFavorite: false
      };
    }

    const favorites = await this.favoriteService.findByUserId(userId);
    const favoritesIds = favorites.map((favorite) => String(favorite.offerId));
    const isFavorite = favoritesIds.includes(offer.id);

    return {
      ...offer,
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
