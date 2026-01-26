import { prop, modelOptions, defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { createSHA256 } from '../../helpers/index.js';
import type { UserType, UserRole } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements UserType {
  constructor(userData: UserType) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.type = userData.type;
  }

  @prop({ required: true })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop()
  public avatarUrl?: string;

  @prop({ required: true })
  private password?: string;

  @prop({ required: true, type: () => String })
  public type: UserRole;

  public getPassword() {
    return this.password;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public verifyPassword(password: string, salt: string): boolean {
    const passwordHash = createSHA256(password, salt);
    return passwordHash === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
