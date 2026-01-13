import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';

import { BaseUserError } from './errors/base-user.error.js';
import { Component } from '../../types/index.js';
import type { ExceptionFilter } from '../../libs/rest/index.js';
import type { Logger } from '../../libs/logger/index.js';


@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger)
    private readonly logger: Logger,
  ) {}

  public catch(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!(error instanceof BaseUserError)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);

    res
      .status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }
}
