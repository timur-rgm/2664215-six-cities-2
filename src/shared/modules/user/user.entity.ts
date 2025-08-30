import type { UserType, UserRole } from '../../types/index.js';

export class UserEntity implements UserType {
  public name: string;
  public email: string;
  public avatarUrl: string;
  public password: string;
  public type: UserRole;
}
