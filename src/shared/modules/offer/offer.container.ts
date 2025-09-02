import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import { OfferModel } from './offer.entity.js';
import { DefaultOfferService } from './default-offer.service.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';

export const createOfferContainer = () => {
  const container = new Container();

  container
    .bind<types.ModelType<OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);

  container
    .bind<OfferService>(Component.OfferService)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .to(DefaultOfferService)
    .inSingletonScope();

  return container;
};
