import { Container } from 'inversify';

import { AuthExceptionFilter } from './auth.exception-filter.js';
import { Component } from '../../types/index.js';
import { DefaultAuthService } from './default-auth.service.js';
import type { AuthService } from './auth-service.interface.js';
import type { ExceptionFilter } from '../../libs/rest/index.js';

export const createAuthContainer = () => {
  const container = new Container();

  container
    .bind<AuthService>(Component.AuthService)
    .to(DefaultAuthService)
    .inSingletonScope();

  container
    .bind<ExceptionFilter>(Component.AuthExceptionFilter)
    .to(AuthExceptionFilter)
    .inSingletonScope();

  return container;
};
