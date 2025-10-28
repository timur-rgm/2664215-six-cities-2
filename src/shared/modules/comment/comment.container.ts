import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Component } from '../../types/index.js';
import { CommentModel, CommentEntity } from './comment.entity.js';

export const createCommentContainer = () => {
  const container = new Container();

  container
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  return container;
};
