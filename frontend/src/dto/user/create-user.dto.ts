export enum UserRole {
  ordinary = 'ordinary',
  pro = 'pro',
}

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public password!: string;
  public type!: UserRole;
}
