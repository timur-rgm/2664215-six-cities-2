import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import { FavoriteModel, type FavoriteEntity, } from './favorite.entity.js';

export const createFavoriteContainer = () => {
  const container = new Container();

  container
    .bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
    .toConstantValue(FavoriteModel);

  return container;
};
