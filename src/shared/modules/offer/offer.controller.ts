import { inject, injectable } from 'inversify';
import type { Response } from 'express';

import {
  BaseController,
  HttpError,
  HttpMethod,
  OfferAlreadyExistsError,
  OfferNotFoundError,
  type RequestWithBody,
  type RequestWithBodyAndParams,
  type RequestWithQuery,
  type RequestWithParams,
} from '../../libs/rest/index.js';
import { City, Component } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { fillRdo, parseBooleanString } from '../../helpers/index.js';
import { OfferRdo } from './rdo/index.js';
import { StatusCodes } from 'http-status-codes';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferService } from './offer-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger)
    protected readonly logger: Logger,

    @inject(Component.OfferService)
    private readonly offerService: OfferService
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
  }

  public async index(
    { query }: RequestWithQuery<{ city?: City, isPremium?: string }>,
    res: Response
  ): Promise<void> {
    const { city, isPremium } = query;
    const offers = await this.offerService.findAll(
      city,
      parseBooleanString(isPremium)
    );
    const responseData = fillRdo(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async show(
    { params }: RequestWithParams<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    try {
      const offer = await this.offerService.findById(params.offerId);
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

  public async create(
    { body }: RequestWithBody<CreateOfferDto>,
    res: Response
  ): Promise<void> {
    try {
      const newOffer = await this.offerService.createOffer(body);
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

  public async update(
    { params, body }: RequestWithBodyAndParams<UpdateOfferDto, {offerId: string}>,
    res: Response
  ): Promise<void> {
    try {
      const updatedOffer = await this.offerService.updateById(
        params.offerId, body
      );

      const offerRdo = fillRdo(OfferRdo, updatedOffer);
      this.ok(res, offerRdo);
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

  public async delete(
    { params }: RequestWithParams<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    await this.offerService.deleteById(params.offerId);
    this.noContent(res);
  }
}
