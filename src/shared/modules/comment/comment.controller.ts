import { injectable, inject } from 'inversify';
import type { Response } from 'express';

import { CommentRdo } from './rdo/index.js';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { CreateCommentDto } from './dto/index.js';
import {
  BaseController,
  HttpMethod,
  type RequestWithBody
} from '../../libs/rest/index.js';
import type { Logger } from '../../libs/logger/index.js';
import { fillRdo } from '../../helpers/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
   @inject(Component.Logger)
   protected readonly logger: Logger,

   @inject(Component.CommentService)
   protected readonly commentService: CommentService
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async create(
    req: RequestWithBody<CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const { body } = req;
    const comment = await this.commentService.createComment(body);
    const commentRdo = fillRdo(CommentRdo, comment);
    this.created(res, commentRdo);
  }
}
