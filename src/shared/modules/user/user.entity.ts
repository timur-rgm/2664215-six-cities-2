import { prop, defaultClasses, getModelForClass } from '@typegoose/typegoose';
import type { UserType, UserRole } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements UserType {
  @prop({ required: true })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop()
  public avatarUrl?: string;

  @prop({ required: true })
  public password: string;

  @prop({ required: true, type: () => String })
  public type: UserRole;
}

export const UserModel = getModelForClass(UserEntity);
