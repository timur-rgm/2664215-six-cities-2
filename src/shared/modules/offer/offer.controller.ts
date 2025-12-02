import { inject, injectable } from 'inversify';
import type { Request, Response } from 'express';

import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import type { RequestWithBody } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import type { Logger } from '../../libs/logger/index.js';
import type { OfferService } from './offer-service.interface.js';
import { fillRdo } from '../../helpers/index.js';
import { OfferRdo } from './rdo/index.js';
import { CreateOfferDto } from './dto/index.js';

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
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll();
    const responseData = fillRdo(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(req: RequestWithBody<CreateOfferDto>, res: Response): Promise<void> {
    const newOffer = await this.offerService.createOffer(req.body);
    const offerRdo = fillRdo(OfferRdo, newOffer);
    this.created(res, offerRdo);
  }
}
