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

  public async findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({ offerId }).exec();
  }

  public async findByOfferName(offerName: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({ title: offerName }).exec();
  }

  public async findByOfferNameOrCreate(offerData: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = await this.findByOfferName(offerData.title);

    if (offer) {
      return offer;
    }

    return this.createOffer(offerData);
  }
}
