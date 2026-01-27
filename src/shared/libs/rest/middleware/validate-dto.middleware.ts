import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';

import { reduceValidationErrors } from '../../../helpers/index.js';
import { ValidationError } from '../../../../rest/errors/index.js';
import type { Middleware } from './middleware.interface.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dtoClass: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction) {
    const { body, path } = req;

    const dtoInstance = plainToInstance(this.dtoClass, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(
        `Validation error: ${path}`,
        reduceValidationErrors(errors)
      );
    }

    next();
  }
}
