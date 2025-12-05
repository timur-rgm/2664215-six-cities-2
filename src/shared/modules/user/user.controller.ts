import { inject, injectable } from 'inversify';
import type { Response } from 'express';

import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { CreateUserDto } from './dto/index.js';
import { Component } from '../../types/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { RequestWithBody } from '../../libs/rest/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
  }

  public create(_req: RequestWithBody<CreateUserDto>, _res: Response) {
    //
  }
}
