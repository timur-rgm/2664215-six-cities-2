export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email «${email}» exists.`);
    this.name = 'UserAlreadyExistsError';
  }
}
