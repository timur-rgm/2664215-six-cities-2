import { createSecretKey } from 'node:crypto';
import { jwtVerify } from 'jose';
import type { Request, Response, NextFunction} from 'express';

import { HttpError } from '../errors/index.js';
import { isTokenPayload } from '../../../guards/index.js';
import { StatusCodes } from 'http-status-codes';
import type { Middleware } from './middleware.interface.js';

export class ParseTokenMiddleware implements Middleware {
  constructor(public readonly jwtSecret: string) {}

  public async execute(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const authorizationHeader = req.headers?.authorization;

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader.split(' ');

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8')
      );

      if (isTokenPayload(payload)) {
        req.tokenPayload = payload;
        return next();
      } else {
        throw new Error('Bad token');
      }
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
