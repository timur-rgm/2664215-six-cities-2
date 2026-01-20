import type { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/index.js';

export interface CommentService {
  createComment(userId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findCommentByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteCommentByOfferId(offerId: string): Promise<number>;
}
