import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';

import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateMongoObjectIdMiddleware,
  UploadFileMiddleware,
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
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto)
      ]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateMongoObjectIdMiddleware('userId'),
        new UploadFileMiddleware(
          this.config.get('UPLOAD_DIRECTORY'),
          'avatar'
        )
      ]
    });
  }

  public async create(
    req: RequestWithBody<CreateUserDto>,
    res: Response
  ): Promise<void> {
    const email = req.body.email;
    const userExists = await this.userService.existsByEmail(email);

    if (userExists) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `User with email ${email} already exists.`,
        'UserController'
      );
    }

    const newUser = await this.userService.create(
      req.body,
      this.config.get('SALT')
    );
    const userRdo = fillRdo(UserRdo, newUser);
    this.created(res, userRdo);
  }

  public async login(
    req: RequestWithBody<LoginUserDto>,
    _res: Response
  ): Promise<void> {
    const email = req.body.email;
    const userExists = await this.userService.existsByEmail(email);

    if (!userExists) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${email} not found.`,
        'UserController'
      );
    }

    await this.userService.login(req.body);
  }

  public async uploadAvatar(
    req: Request,
    res: Response
  ): Promise<void> {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
