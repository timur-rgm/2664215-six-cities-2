import express from 'express';
import { inject, injectable } from 'inversify';

import { Component } from '../shared/types/index.js';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import {
  ParseTokenMiddleware,
  type Controller,
  type ExceptionFilter
} from '../shared/libs/rest/index.js';
import { STATIC_DIRECTORY_ROUTE, UPLOAD_ROUTE } from './rest.constants.js';
import type { Config, RestSchema } from '../shared/libs/config/index.js';
import type { DatabaseClient } from '../shared/libs/database-client/index.js';
import type { Logger } from '../shared/libs/logger/index.js';

@injectable()
export class RestApplication {
  private readonly server: express.Express;

  constructor(
    @inject(Component.AppExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,

    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: ExceptionFilter,

    @inject(Component.Config)
    private readonly config: Config<RestSchema>,

    @inject(Component.CommentController)
    private readonly commentController: Controller,

    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,

    @inject(Component.HttpExceptionFilter)
    private readonly httpExceptionFilter: ExceptionFilter,

    @inject(Component.OfferController)
    private readonly offersController: Controller,

    @inject(Component.Logger)
    private readonly logger: Logger,

    @inject(Component.UserController)
    private readonly userController: Controller,

    @inject(Component.ValidationExceptionFilter)
    private readonly validationExceptionFilter: ExceptionFilter,
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

  private initMiddleware() {
    this.server.use(express.json());
    this.server.use(
      STATIC_DIRECTORY_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    this.server.use(
      UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    const parseTokenMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(parseTokenMiddleware.execute);
  }

  private initControllers() {
    this.server.use('/comments', this.commentController.router);
    this.server.use('/offers', this.offersController.router);
    this.server.use('/users', this.userController.router);
  }

  private initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch);
    this.server.use(this.validationExceptionFilter.catch);
    this.server.use(this.httpExceptionFilter.catch);
    this.server.use(this.appExceptionFilter.catch);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info('Initializing database...');
    await this.initDB();
    this.logger.info('Database initialized');

    this.logger.info('Init app-level middleware');
    this.initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    this.initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    this.initExceptionFilters();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Try to init server…');
    this.initServer();
    this.logger.info(getFullServerPath(
      this.config.get('HOST'),
      this.config.get('PORT')
    ));
  }
}
