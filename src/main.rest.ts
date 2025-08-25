import 'reflect-metadata';
import { Container } from 'inversify';

import { Component } from './shared/types/index.js';
import { MongoDatabaseClient } from './shared/libs/database-client/index.js';
import { PinoLogger } from './shared/libs/logger/index.js';
import { RestConfig } from './shared/libs/config/index.js';
import { RestApplication } from './rest/index.js';
import type { DatabaseClient } from './shared/libs/database-client/index.js';
import type { Config, RestSchema } from './shared/libs/config/index.js';
import type { Logger } from './shared/libs/logger/index.js';
import { getErrorMessage } from './shared/helpers/index.js';

const bootstrap = async () => {
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

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
};

bootstrap().catch((error) => console.error(getErrorMessage(error)));
