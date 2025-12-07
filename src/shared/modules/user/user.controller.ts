import { inject, injectable } from 'inversify';
import type { Response } from 'express';

import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { CreateUserDto, LoginUserDto } from './dto/index.js';
import { fillRdo } from '../../helpers/index.js';
import { UserRdo } from './rdo/index.js';
import type { Config, RestSchema } from '../../libs/config/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { RequestWithBody } from '../../libs/rest/index.js';
import type { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
  }

  public async create(
    req: RequestWithBody<CreateUserDto>,
    res: Response
  ): Promise<void> {
    const newUser = await this.userService.create(req.body, this.config.get('SALT'));
    const userRdo = fillRdo(UserRdo, newUser);
    this.created(res, userRdo);
  }

  public async login(
    req: RequestWithBody<LoginUserDto>,
    _res: Response
  ): Promise<void> {
    await this.userService.login(req.body);
  }
}
