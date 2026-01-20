import { injectable, inject } from 'inversify';
import type { Response } from 'express';

import { CommentRdo } from './rdo/index.js';
import { Component } from '../../types/index.js';
import { CreateCommentDto } from './dto/index.js';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  type RequestWithBody, PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { fillRdo } from '../../helpers/index.js';
import { StatusCodes } from 'http-status-codes';
import type { CommentService } from './comment-service.interface.js';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferService } from '../offer/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
   @inject(Component.CommentService)
   private readonly commentService: CommentService,

   @inject(Component.Logger)
   protected readonly logger: Logger,

   @inject(Component.OfferService)
   private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
      ]
    });
  }

  public async create(
    req: RequestWithBody<CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const { body } = req;
    const { locals } = res;

    const offerExists = await this.offerService.exists(body.offerId);

    if (!offerExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.createComment(body, locals.tokenPayload!.id);
    const commentRdo = fillRdo(CommentRdo, comment);
    this.created(res, commentRdo);
  }
}
