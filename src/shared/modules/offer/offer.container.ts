import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import { OfferController } from './offer.controller.js';
import { OfferModel } from './offer.entity.js';
import { DefaultOfferService } from './default-offer.service.js';
import type { OfferEntity } from './offer.entity.js';
import type { OfferService } from './offer-service.interface.js';
import type { Controller } from '../../libs/rest/index.js';

export const createOfferContainer = () => {
  const container = new Container();

  container
    .bind<Controller>(Component.OfferController)
    .to(OfferController)
    .inSingletonScope();

  container
    .bind<types.ModelType<OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);

  container
    .bind<OfferService>(Component.OfferService)
    .to(DefaultOfferService)
    .inSingletonScope();

  return container;
};
