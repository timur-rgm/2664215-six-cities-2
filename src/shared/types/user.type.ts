export type UserRole = 'ordinary' | 'pro'

export type UserType = {
  name: string;
  email: string;
  avatarUrl?: string;
  type: UserRole;
}
