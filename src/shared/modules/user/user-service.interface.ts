import type { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/index.js';
import { UserEntity } from './user.entity.js';

export interface UserService {
  create(userData: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(userData: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}
