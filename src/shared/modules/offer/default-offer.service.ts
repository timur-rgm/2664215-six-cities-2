import { inject, injectable } from 'inversify';
import { types, type DocumentType } from '@typegoose/typegoose';
import type { PipelineStage } from 'mongoose';

import { Component, City } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { OfferAlreadyExistsError, OfferNotFoundError } from '../../libs/rest/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger)
    private readonly logger: Logger,

    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public findAll(
    city?: City,
    isPremium?: boolean
  ): Promise<DocumentType<OfferEntity>[]> {
    const match: Record<string, unknown> = {};

    if (city) {
      match.city = city;
    }

    if (isPremium !== undefined) {
      match.isPremium = isPremium;
    }

    const pipeline: PipelineStage[] = [];

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push(
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
    );

    return this.offerModel.aggregate(pipeline).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();

    if (!offer) {
      throw new OfferNotFoundError();
    }

    return offer;
  }

  public async createOffer(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const existingOffer = await this.offerModel.findOne({ title: offerData.title });

    if (existingOffer) {
      throw new OfferAlreadyExistsError(offerData.title);
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

  public findAllFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ isFavorite: true })
      .populate(['userId'])
      .exec();
  }

  public async updateById(
    offerId: string,
    offerData: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity>> {
    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(offerId, offerData, { new: true })
      .populate(['userId'])
      .exec();

    if (!updatedOffer) {
      throw new OfferNotFoundError();
    }

    return updatedOffer;
  }

  public async setIsFavorite(
    offerId: string,
    isFavorite: boolean
  ): Promise<DocumentType<OfferEntity>> {
    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(offerId, { isFavorite }, { new: true })
      .populate(['userId'])
      .exec();

    if (!updatedOffer) {
      throw new OfferNotFoundError();
    }

    return updatedOffer;
  }
}
