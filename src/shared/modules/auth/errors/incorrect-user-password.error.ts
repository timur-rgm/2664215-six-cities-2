import { StatusCodes } from 'http-status-codes';
import { BaseUserError } from './base-user.error.js';

export class IncorrectUserPasswordError extends BaseUserError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect user name or password');
  }
}
