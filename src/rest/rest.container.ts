import { Container } from 'inversify';

import {
  AppExceptionFilter,
  HttpErrorExceptionFilter,
  ValidationExceptionFilter
} from '../shared/libs/rest/index.js';
import { Component } from '../shared/types/index.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { PathTransformer } from '../shared/libs/rest/transform/index.js';
import { PinoLogger } from '../shared/libs/logger/index.js';
import { RestConfig } from '../shared/libs/config/index.js';
import { RestApplication } from './rest.application.js';
import type { Config, RestSchema } from '../shared/libs/config/index.js';
import type { DatabaseClient } from '../shared/libs/database-client/index.js';
import type { ExceptionFilter } from '../shared/libs/rest/index.js';
import type { Logger } from '../shared/libs/logger/index.js';

export const createRestApplicationContainer = () => {
  const container = new Container();

  container
    .bind<ExceptionFilter>(Component.AppExceptionFilter)
    .to(AppExceptionFilter)
    .inSingletonScope();

  container
    .bind<Config<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();

  container
    .bind<DatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();

  container
    .bind<ExceptionFilter>(Component.HttpExceptionFilter)
    .to(HttpErrorExceptionFilter)
    .inSingletonScope();

  container
    .bind<Logger>(Component.Logger)
    .to(PinoLogger)
    .inSingletonScope();

  container
    .bind<PathTransformer>(Component.PathTransformer)
    .to(PathTransformer)
    .inSingletonScope();

  container
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();

  container
    .bind<ExceptionFilter>(Component.ValidationExceptionFilter)
    .to(ValidationExceptionFilter)
    .inSingletonScope();

  return container;
};
