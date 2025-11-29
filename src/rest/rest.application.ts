import express from 'express';
import type { Express } from 'express';
import { inject, injectable } from 'inversify';

import { Component } from '../shared/types/index.js';
import type { Config, RestSchema } from '../shared/libs/config/index.js';
import type { Controller } from '../shared/libs/rest/index.js';
import type { DatabaseClient } from '../shared/libs/database-client/index.js';
import type { Logger } from '../shared/libs/logger/index.js';
import { getMongoURI } from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController) private readonly offersController: Controller,
    @inject(Component.Logger) private readonly logger: Logger,
  ) {
    this.server = express();
  }

  private initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

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

  private initControllers() {
    this.server.use('/offers', this.offersController.router);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info('Initializing database...');
    await this.initDB();
    this.logger.info('Database initialized');

    this.logger.info('Init controllers');
    this.initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Try to init server…');
    this.initServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
