import { Container } from 'inversify';

import { Component } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import type { UserService } from './user-service.interface.js';

export const createUserContainer = () => {
  const container = new Container();

  container
    .bind<UserService>(Component.UserService)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .to(DefaultUserService)
    .inSingletonScope();

  return container;
};
