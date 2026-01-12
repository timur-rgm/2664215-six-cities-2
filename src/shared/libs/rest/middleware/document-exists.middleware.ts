import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '../errors/index.js';
import type { DocumentExists } from '../../../types/index.js';
import type { Middleware } from './middleware.interface.js';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramKey: string
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction) {
    const { params } = req;

    const documentId = params[this.paramKey];
    const documentsExists = await this.service.exists(documentId);

    if (!documentsExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with id ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
