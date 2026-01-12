import { StatusCodes } from 'http-status-codes';
import { BaseUserError } from './base-user.error.js';

export class UserNotFoundError extends BaseUserError {
  constructor() {
    super(StatusCodes.NOT_FOUND, 'User not found');
  }
}
