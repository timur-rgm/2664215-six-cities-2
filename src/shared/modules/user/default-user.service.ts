import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import type { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/index.js';
import { Component } from '../../types/index.js';
import type { Logger } from '../../libs/logger/index.js';

@injectable()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(userData: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(userData);
    user.setPassword(userData.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);
    return result;
  }
}
