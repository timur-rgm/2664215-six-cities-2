import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { Router, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Component } from '../../../types/index.js';
import { PathTransformer } from '../transform/index.js';
import type { Controller } from './controller.interface.js';
import type { Logger } from '../../logger/index.js';
import type { Route } from '../types/index.js';

const DEFAULT_CONTENT_TYPE = 'application/json';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  @inject(Component.PathTransformer)
  private readonly pathTransformer: PathTransformer;

  constructor(
    protected readonly logger: Logger,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute({ handler, method, path, middlewares }: Route): void {
    const wrappedRouteHandler = asyncHandler(handler.bind(this));
    const wrappedMiddlewareHandlers = middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );
    const allHandlers = wrappedMiddlewareHandlers
      ? [...wrappedMiddlewareHandlers, wrappedRouteHandler]
      : wrappedRouteHandler;
    this._router[method](path, allHandlers);
    this.logger.info(`Route registered: ${method.toUpperCase()} ${path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);

    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
}
