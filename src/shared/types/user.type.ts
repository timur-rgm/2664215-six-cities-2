export enum UserRole {
  ordinary = 'ordinary',
  pro = 'pro',
}

export type UserType = {
  name: string;
  email: string;
  avatarUrl?: string;
  type: UserRole;
}
