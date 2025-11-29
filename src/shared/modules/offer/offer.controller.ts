import { inject, injectable } from 'inversify';
import { type Request, type Response } from 'express';

import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { type Logger } from '../../libs/logger/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public index(req: Request, res: Response): void {
    // Код обработчика
  }

  public create(req: Request, res: Response): void {
    // Код обработчика
  }
}
