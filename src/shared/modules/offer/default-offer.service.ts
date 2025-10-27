import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import type { DocumentType } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import type { OfferService } from './offer-service.interface.js';
import type { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async createOffer(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(offerData);
    this.logger.info(`New offer created: ${offerData.title}`);
    return result;
  }

  public find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();
  }
}
