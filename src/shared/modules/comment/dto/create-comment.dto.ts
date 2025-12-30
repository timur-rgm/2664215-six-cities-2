import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CreateCommentValidationMessage } from './create-comment.validation.messages.js';

export class CreateCommentDto {
  @IsString({
    message: CreateCommentValidationMessage.text.type
  })
  @Length(5, 1024, {
    message: 'min is 5, max is 1024'
  })
  public text: string;

  @IsInt({
    message: CreateCommentValidationMessage.rating.type
  })
  @Min(1, {
    message: CreateCommentValidationMessage.rating.minValue
  })
  @Max(5, {
    message: CreateCommentValidationMessage.rating.maxValue
  })
  public rating: number;

  @IsMongoId({
    message: CreateCommentValidationMessage.offerId.format
  })
  public offerId: string;

  @IsMongoId({
    message: CreateCommentValidationMessage.userId.format
  })
  public userId: string;
}
