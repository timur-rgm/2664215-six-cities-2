import { injectable, inject } from 'inversify';
import { types, type DocumentType } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import { CreateCommentDto } from './dto/index.js';
import type { CommentService } from './comment-service.interface.js';
import type { CommentEntity } from './comment.entity.js';
import type { OfferService } from '../offer/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,

    @inject(Component.OfferService)
    private readonly offerService: OfferService,
  ) {}

  public async createComment(
    dto: CreateCommentDto,
    userId: string,
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({ ...dto, userId });
    const { offerId } = comment;

    const [{ averageRating }] = await this.commentModel
      .aggregate<{averageRating: number }>([
        { $match: { offerId } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } },
      ])
      .exec();

    await this.offerService.updateRating(
      String(offerId),
      averageRating
    );

    return comment.populate('userId');
  }

  public async findCommentByOfferId(
    offerId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .populate('userId')
      .exec();
  }

  public async deleteCommentByOfferId(
    offerId: string
  ): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
