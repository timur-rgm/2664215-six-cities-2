import { PinoLogger } from './shared/libs/logger/index.js';
import { RestApplication } from './rest/index.js';

const bootstrap = async () => {
  const logger = new PinoLogger();

  const application = new RestApplication(logger);
  await application.init();
};

bootstrap();
