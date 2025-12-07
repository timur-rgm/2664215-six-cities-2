import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import type { DocumentType } from '@typegoose/typegoose';

import { Component, City } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async createOffer(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const existingOffer = await this.offerModel.findOne({ title: offerData.title });

    if (existingOffer) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Offer with name «${offerData.title}» exists.`,
        'DefaultOfferService'
      );
    }

    const result = await this.offerModel.create(offerData);
    this.logger.info(`New offer created: ${offerData.title}`);

    return result;
  }

  public deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public findAll(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
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

  public findAllFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ isFavorite: true })
      .populate(['userId'])
      .exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();
  }

  public findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .populate(['userId'])
      .exec();
  }

  public async updateById(offerId: string, offerData: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, offerData, { new: true })
      .populate(['userId'])
      .exec();
  }
}
