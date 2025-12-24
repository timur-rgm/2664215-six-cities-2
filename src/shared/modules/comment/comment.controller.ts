import { injectable, inject } from 'inversify';
import type { Request, Response } from 'express';

import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import type { Logger } from '../../libs/logger/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
   @inject(Component.Logger)
   protected readonly logger: Logger,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async create(
    _req: Request,
    _res: Response
  ): Promise<void> {

  }
}
