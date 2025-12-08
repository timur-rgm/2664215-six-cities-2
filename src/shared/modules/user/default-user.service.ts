import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import type { DocumentType } from '@typegoose/typegoose';

import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/index.js';
import { Component } from '../../types/index.js';
import {
  NotImplementedError,
  UserAlreadyExistsError,
  UserNotFoundError } from '../../libs/rest/index.js';
import { UserEntity } from './user.entity.js';
import type { Logger } from '../../libs/logger/index.js';
import type { UserService } from './user-service.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(
    dto: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(dto.email);
    }

    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);
    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findByEmailOrCreate(
    userData: CreateUserDto,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(userData.email);

    if (user) {
      return user;
    }

    return this.create(userData, salt);
  }

  public async login(dto: LoginUserDto) {
    const existingUser = await this.findByEmail(dto.email);

    if (!existingUser) {
      throw new UserNotFoundError(dto.email);
    }

    throw new NotImplementedError();
  }

  public async updateUserById(
    userId: string,
    dto: UpdateUserDto
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec();
  }
}
