import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '../errors/index.js';
import type { Middleware } from './middleware.interface.js';

export class PrivateRouteMiddleware implements Middleware {
  public execute(_req: Request, res: Response, next: NextFunction) {
    const { locals } = res;

    if (!locals.tokenPayload) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
