import { inject, injectable } from 'inversify';

import { Component } from '../../types/index.js';
import type { AuthService } from './auth-service.interface.js';
import type { Config, RestSchema } from '../../libs/config/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { UserService } from '../user/index.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Config)
    private readonly config: Config<RestSchema>,

    @inject(Component.Logger)
    private readonly logger: Logger,

    @inject(Component.UserService)
    private readonly userService: UserService
  ) {}


}
