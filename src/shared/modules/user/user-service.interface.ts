import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/index.js';
import type { DocumentType } from '@typegoose/typegoose';
import type { UserEntity } from './user.entity.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findByEmailOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  login(dto: LoginUserDto): Promise<void>;
  updateUserById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
}
