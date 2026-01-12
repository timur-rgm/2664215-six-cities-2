import * as crypto from 'node:crypto';
import { inject, injectable } from 'inversify';
import { SignJWT } from 'jose';

import { Component, type TokenPayload } from '../../types/index.js';
import type { AuthService } from './auth-service.interface.js';
import type { Config, RestSchema } from '../../libs/config/index.js';
import type { Logger } from '../../libs/logger/index.js';
import {
  LoginUserDto,
  type UserEntity,
  type UserService
} from '../user/index.js';

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

  public async authenticate({ email, id, name }: UserEntity): Promise<string> {
    this.logger.info(`Create token for ${email}`);

    const jwtAlgorithm = this.config.get('JWT_ALGORITHM');
    const jwtExpired = this.config.get('JWT_EXPIRED');
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');

    const tokenPayload: TokenPayload = { email, id, name };

    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: jwtAlgorithm })
      .setIssuedAt()
      .setExpirationTime(jwtExpired)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User with email ${dto.email} not found.`);
      throw new Error(`User with email ${dto.email} not found.`);
    }

    const salt = this.config.get('SALT');

    if (!user.verifyPassword(dto.password, salt)) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new Error(`Incorrect password for ${dto.email}`);
    }

    return user;
  }
}
