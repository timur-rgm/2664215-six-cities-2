import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import { UserController } from './user.controller.js';
import { UserModel } from './user.entity.js';
import type { UserService } from './user-service.interface.js';
import type { UserEntity } from './user.entity.js';
import type { Controller } from '../../libs/rest/index.js';

export const createUserContainer = () => {
  const container = new Container();

  container
    .bind<UserService>(Component.UserService)
    .to(DefaultUserService)
    .inSingletonScope();

  container
    .bind<Controller>(Component.UserController)
    .to(UserController)
    .inSingletonScope();

  container
    .bind<types.ModelType<UserEntity>>(Component.UserModel)
    .toConstantValue(UserModel);

  return container;
};
