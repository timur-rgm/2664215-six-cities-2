import { validate } from 'class-validator';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import type { Request, Response, NextFunction } from 'express';

import type { Middleware } from './middleware.interface.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dtoClass: ClassConstructor<object>) {}

  public async execute(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    const dtoInstance = plainToInstance(this.dtoClass, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send(errors);

      return;
    }

    next();
  }
}
