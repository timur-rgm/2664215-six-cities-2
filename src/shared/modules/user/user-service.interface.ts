import type { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto, UpdateUserDto } from './dto/index.js';
import { UserEntity } from './user.entity.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findByEmailOrCreate(userData: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateUserById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
}
