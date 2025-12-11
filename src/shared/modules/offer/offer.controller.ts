import { inject, injectable } from 'inversify';
import type { Request, Response } from 'express';

import {
  BaseController,
  HttpError,
  HttpMethod,
  OfferAlreadyExistsError,
  OfferNotFoundError } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { CreateOfferDto } from './dto/index.js';
import { fillRdo } from '../../helpers/index.js';
import { OfferRdo } from './rdo/index.js';
import { StatusCodes } from 'http-status-codes';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferService } from './offer-service.interface.js';
import type { RequestWithBody } from '../../libs/rest/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll();
    const responseData = fillRdo(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(req: RequestWithBody<CreateOfferDto>, res: Response): Promise<void> {
    try {
      const newOffer = await this.offerService.createOffer(req.body);
      const offerRdo = fillRdo(OfferRdo, newOffer);
      this.created(res, offerRdo);
    } catch (error) {
      if (error instanceof OfferAlreadyExistsError) {
        throw new HttpError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          error.message,
          'OfferController'
        );
      }

      throw error;
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    await this.offerService.deleteById(req.params.id);
    this.noContent(res);
  }

  public async show(req: Request, res: Response): Promise<void> {
    try {
      const offer = await this.offerService.findById(req.params.id);
      const responseData = fillRdo(OfferRdo, offer);
      this.ok(res, responseData);
    } catch (error) {
      if (error instanceof OfferNotFoundError) {
        throw new HttpError(
          StatusCodes.NOT_FOUND,
          error.message,
          'OfferController'
        );
      }

      throw error;
    }
  }
}
