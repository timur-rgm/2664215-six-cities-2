import { Expose } from 'class-transformer';
import type { UserRole } from '../../../types/index.js';

export class LoggedUserRdo {
  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public type: UserRole;

  @Expose()
  public avatarUrl: string;

  @Expose()
  public token: string;
}
