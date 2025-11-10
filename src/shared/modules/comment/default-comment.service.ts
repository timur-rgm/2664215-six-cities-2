import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { OfferService } from '../offer/index.js';
import { CreateCommentDto } from './dto/index.js';
import { Component } from '../../types/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async createComment(commentData: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(commentData);
    const { offerId } = comment;

    const [{ averageRating }] = await this.commentModel
      .aggregate([
        {
          $match: { offerId }
        },
        {
          $group: { _id: null, averageRating: { $avg: '$rating' } }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId'
          }
        },
        {
          $unwind: '$userId'
        },
      ])
      .exec();

    await this.offerService.updateById(String(offerId), { rating: averageRating });
    return comment.populate('userId');
  }

  public async findCommentByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .populate('userId')
      .exec();
  }

  public async deleteCommentByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
