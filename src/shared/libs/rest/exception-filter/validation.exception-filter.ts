import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';

import { ApplicationError } from '../../../../rest/types/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { Component } from '../../../types/index.js';
import { ValidationError } from '../../../../rest/errors/index.js';
import type { ExceptionFilter } from './exception-filter.interface.js';
import type { Logger } from '../../logger/index.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger)
    private readonly logger: Logger
  ) {
    this.logger.info('Register ValidationExceptionFilter');
    this.catch = this.catch.bind(this);
  }

  public catch(error: Error, _req: Request, res: Response, next:NextFunction) {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(error.message, error);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(
        ApplicationError.ValidationError,
        error.message,
        error.details
      ));
  }
}
