import { injectable, inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';

import { Component } from '../../../types/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { Error } from 'mongoose';
import { HttpError } from '../errors/index.js';
import type { ExceptionFilter } from './exception-filter.interface.js';
import type { Logger } from '../../logger/index.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  private handleHttpError(
    error: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    this.logger.error(
      `[${error.detail}]: ${error.httpStatusCode} — ${error.message}`,
      error
    );

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error.message));
  }

  private handleOtherError(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    this.logger.error(error.message, error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(error.message));
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    this.handleOtherError(error, req, res, next);
  }
}
