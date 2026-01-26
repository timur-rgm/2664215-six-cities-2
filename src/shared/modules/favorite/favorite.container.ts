import { Container } from 'inversify';

import { Component, type ModelType } from '../../types/index.js';
import { DefaultFavoriteService } from './default-favorite.service.js';
import { FavoriteModel, type FavoriteEntity } from './favorite.entity.js';
import type { FavoriteService } from './favorite-service.interface.js';

export const createFavoriteContainer = () => {
  const container = new Container();

  container
    .bind<ModelType<FavoriteEntity>>(Component.FavoriteModel)
    .toConstantValue(FavoriteModel);

  container
    .bind<FavoriteService>(Component.FavoriteService)
    .to(DefaultFavoriteService)
    .inSingletonScope();

  return container;
};
