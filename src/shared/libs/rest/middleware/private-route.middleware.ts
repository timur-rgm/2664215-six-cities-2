import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '../errors/index.js';
import type { Middleware } from './middleware.interface.js';

export class PrivateRouteMiddleware implements Middleware {
  public execute(req: Request, _res: Response, next: NextFunction) {
    const { tokenPayload } = req;

    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
