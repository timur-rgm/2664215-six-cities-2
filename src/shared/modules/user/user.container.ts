import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import type { UserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';

export const createUserContainer = () => {
  const container = new Container();

  container
    .bind<types.ModelType<UserEntity>>(Component.UserModel)
    .toConstantValue(UserModel);

  container
    .bind<UserService>(Component.UserService)
    .to(DefaultUserService)
    .inSingletonScope();

  return container;
};
