import type { DocumentType } from '@typegoose/typegoose';
import { LoginUserDto, type UserEntity } from '../user/index.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<DocumentType<UserEntity>>;
}
