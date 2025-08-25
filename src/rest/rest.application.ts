import { injectable, inject } from 'inversify';

import { Component } from '../shared/types/index.js';
import type { Config, RestSchema } from '../shared/libs/config/index.js';
import type { DatabaseClient } from '../shared/libs/database-client/index.js';
import type { Logger } from '../shared/libs/logger/index.js';
import { getMongoURI } from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  private async initDB() {
    const mongoURI = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    await this.databaseClient.connect(mongoURI);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info('Initializing database...');
    await this.initDB();
    this.logger.info('Database initialized');
  }
}
