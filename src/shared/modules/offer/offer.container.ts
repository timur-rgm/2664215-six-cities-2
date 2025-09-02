import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import { OfferModel } from './offer.entity.js';
import type { OfferEntity } from './offer.entity.js';

export const createOfferContainer = () => {
  const container = new Container();

  container
    .bind<types.ModelType<OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);

  return container;
};
