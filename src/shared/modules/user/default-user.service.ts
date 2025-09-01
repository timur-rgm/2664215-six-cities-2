import type { DocumentType } from '@typegoose/typegoose';
import type { UserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { CreateUserDto } from './dto/index.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class DefaultUserService implements UserService {
  public async create(userData: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(userData);
    user.setPassword(userData.password, salt);

    return UserModel.create(user);
  }
}
