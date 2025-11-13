import 'reflect-metadata';
import { Container } from 'inversify';

import { Component } from './shared/types/index.js';
import { RestApplication } from './rest/index.js';
import { getErrorMessage } from './shared/helpers/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createUserContainer } from './shared/modules/user/index.js';

const bootstrap = async () => {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createCommentContainer(),
    createOfferContainer(),
    createUserContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
};

bootstrap().catch((error) => console.error(getErrorMessage(error)));
