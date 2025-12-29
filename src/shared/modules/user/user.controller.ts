import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import type { Response } from 'express';

import {
  BaseController,
  HttpError,
  HttpMethod,
  NotImplementedError,
  UserAlreadyExistsError,
  UserNotFoundError,
  ValidateDtoMiddleware,
  type RequestWithBody,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { CreateUserDto, LoginUserDto } from './dto/index.js';
import { fillRdo } from '../../helpers/index.js';
import { UserRdo } from './rdo/index.js';
import type { Config, RestSchema } from '../../libs/config/index.js';
import type { Logger } from '../../libs/logger/index.js';
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

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login
    });
  }

  public async create(
    req: RequestWithBody<CreateUserDto>,
    res: Response
  ): Promise<void> {
    try {
      const newUser = await this.userService.create(req.body, this.config.get('SALT'));
      const userRdo = fillRdo(UserRdo, newUser);
      this.created(res, userRdo);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new HttpError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          error.message,
          'UserController'
        );
      }

      throw error;
    }
  }

  public async login(
    req: RequestWithBody<LoginUserDto>,
    _res: Response
  ): Promise<void> {
    try {
      await this.userService.login(req.body);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new HttpError(
          StatusCodes.UNAUTHORIZED,
          error.message,
          'UserController'
        );
      }

      if (error instanceof NotImplementedError) {
        throw new HttpError(
          StatusCodes.NOT_IMPLEMENTED,
          error.message,
          'UserController',
        );
      }

      throw error;
    }
  }
}
