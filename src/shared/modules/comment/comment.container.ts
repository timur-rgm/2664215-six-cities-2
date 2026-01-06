import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { CommentModel, type CommentEntity } from './comment.entity.js';
import { Component } from '../../types/index.js';
import { CommentController } from './comment.controller.js';
import { DefaultCommentService } from './default-comment.service.js';
import { type CommentService } from './comment-service.interface.js';
import { type Controller } from '../../libs/rest/index.js';

export const createCommentContainer = () => {
  const container = new Container();

  container
    .bind<Controller>(Component.CommentController)
    .to(CommentController)
    .inSingletonScope();

  container
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  container
    .bind<CommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();

  return container;
};
