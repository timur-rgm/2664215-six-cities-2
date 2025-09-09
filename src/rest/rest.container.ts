import { Container } from 'inversify';

import { Component } from '../shared/types/index.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { PinoLogger } from '../shared/libs/logger/index.js';
import { RestConfig } from '../shared/libs/config/index.js';
import { RestApplication } from './rest.application.js';
import type { DatabaseClient } from '../shared/libs/database-client/index.js';
import type { Config, RestSchema } from '../shared/libs/config/index.js';
import type { Logger } from '../shared/libs/logger/index.js';

export const createRestApplicationContainer = () => {
  const container = new Container();

  container
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();

  container
    .bind<Config<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();

  container
    .bind<Logger>(Component.Logger)
    .to(PinoLogger)
    .inSingletonScope();

  container
    .bind<DatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();

  return container;
};
