import { inject, injectable } from 'inversify';
import type { Response } from 'express';

import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateMongoObjectIdMiddleware,
  type RequestWithBody,
  type RequestWithBodyAndParams,
  type RequestWithQuery,
  type RequestWithParams,
} from '../../libs/rest/index.js';
import { City, Component } from '../../types/index.js';
import { CommentRdo } from '../comment/rdo/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { fillRdo, parseBooleanString } from '../../helpers/index.js';
import { OfferRdo } from './rdo/index.js';
import { StatusCodes } from 'http-status-codes';
import type { CommentService } from '../comment/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferService } from './offer-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.CommentService)
    private readonly commentService: CommentService,

    @inject(Component.Logger)
    protected readonly logger: Logger,

    @inject(Component.OfferService)
    private readonly offerService: OfferService
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateMongoObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService,
          'Offer',
          'offerId'
        ),
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateMongoObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(
          this.offerService,
          'Offer',
          'offerId'
        ),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateMongoObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService,
          'Offer',
          'offerId'
        ),
      ]
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.addToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateMongoObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService,
          'Offer',
          'offerId'
        ),
      ]
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateMongoObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService,
          'Offer',
          'offerId'
        ),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateMongoObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService,
          'Offer',
          'offerId'
        ),
      ]
    });
  }

  public async index(
    req: RequestWithQuery<{
      city?: City,
      isPremium?: string,
      isFavorite?: string,
    }>,
    res: Response
  ): Promise<void> {
    const { query, tokenPayload } = req;
    const { city, isPremium, isFavorite } = query;

    const offers = await this.offerService.findAll(
      city,
      parseBooleanString(isPremium),
      parseBooleanString(isFavorite),
      tokenPayload?.id
    );
    const responseData = fillRdo(OfferRdo, offers);

    this.ok(res, responseData);
  }

  public async show(
    req: RequestWithParams<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const { params } = req;
    const offer = await this.offerService.findById(params.offerId);
    const responseData = fillRdo(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async create(
    req: RequestWithBody<CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const { body, tokenPayload } = req;
    const title = body.title;

    const offerExists = await this.offerService.existsByTitle(title);

    if (offerExists) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Offer with name ${title} already exists`,
        'OfferController'
      );
    }

    const newOffer = await this.offerService.createOffer(body, tokenPayload.id);
    const offerRdo = fillRdo(OfferRdo, newOffer);
    this.created(res, offerRdo);
  }

  public async update(
    req: RequestWithBodyAndParams<UpdateOfferDto, { offerId: string }>,
    res: Response
  ): Promise<void> {
    const { params, body } = req;
    const updatedOffer = await this.offerService.updateById(
      params.offerId, body
    );
    const offerRdo = fillRdo(OfferRdo, updatedOffer);
    this.ok(res, offerRdo);
  }

  public async delete(
    req: RequestWithParams<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const { params } = req;
    await this.offerService.deleteById(params.offerId);
    this.noContent(res);
  }

  public async addToFavorites(
    req: RequestWithParams<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const { params, tokenPayload } = req;
    const updatedOffer = await this.offerService.addToFavorites(
      params.offerId,
      tokenPayload.id
    );
    const offerRdo = fillRdo(OfferRdo, updatedOffer);
    this.ok(res, offerRdo);
  }

  public async removeFromFavorites(
    req: RequestWithParams<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const { params, tokenPayload } = req;
    const updatedOffer = await this.offerService.removeFromFavorites(
      params.offerId,
      tokenPayload.id
    );
    const offerRdo = fillRdo(OfferRdo, updatedOffer);
    this.ok(res, offerRdo);
  }

  public async getComments(
    req: RequestWithParams<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const { params } = req;
    const { offerId } = params;
    const comments = await this.commentService.findCommentByOfferId(offerId);
    const commentsRdo = fillRdo(CommentRdo, comments);
    this.ok(res, commentsRdo);
  }
}
