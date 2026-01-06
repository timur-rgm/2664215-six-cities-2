import { Types } from 'mongoose';
import { type NextFunction, type Request, type Response } from 'express';

import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { type Middleware } from './middleware.interface.js';

export class ValidateMongoObjectIdMiddleware implements Middleware {
  constructor(private paramKey: string) {}

  public execute(req: Request, _res: Response, next: NextFunction) {
    const { params } = req;

    const objectId = params[this.paramKey];
    const isValidObjectId = Types.ObjectId.isValid(objectId);

    if (isValidObjectId) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
