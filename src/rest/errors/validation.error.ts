import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../shared/libs/rest/index.js';
import type { ValidationErrorField } from '../types/index.js';

export class ValidationError extends HttpError {
  public details: ValidationErrorField[] = [];

  constructor(message: string, errors: ValidationErrorField[]) {
    super(StatusCodes.BAD_REQUEST, message);
    this.details = errors;
  }
}
