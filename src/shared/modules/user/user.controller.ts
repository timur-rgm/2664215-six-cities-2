import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';

import { AuthService } from '../auth/index.js';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateMongoObjectIdMiddleware,
  UploadFileMiddleware,
  type RequestWithBody,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { CreateUserDto, LoginUserDto } from './dto/index.js';
import { fillRdo } from '../../helpers/index.js';
import { LoggedUserRdo, UserRdo } from './rdo/index.js';
import type { Config, RestSchema } from '../../libs/config/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.AuthService)
    private readonly authService: AuthService,

    @inject(Component.Config)
    private readonly config: Config<RestSchema>,

    @inject(Component.Logger)
    protected readonly logger: Logger,

    @inject(Component.UserService)
    private readonly userService: UserService
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
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
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
    res: Response
  ): Promise<void> {
    const user = await this.authService.verify(req.body);
    const token = await this.authService.authenticate(user);
    const responseData = fillRdo(LoggedUserRdo, user);
    const responseDataWithToken = Object.assign(responseData, { token });
    this.ok(res, responseDataWithToken);
  }

  public async checkAuth(
    _req: Request,
    res: Response
  ): Promise<void> {
    const { locals } = res;

    const user = await this.userService.findByEmail(locals.tokenPayload!.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const responseData = fillRdo(LoggedUserRdo, user);
    this.ok(res, responseData);
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
