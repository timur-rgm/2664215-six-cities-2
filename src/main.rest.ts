import { PinoLogger } from './shared/libs/logger/index.js';
import { RestConfig } from './shared/libs/config/index.js';
import { RestApplication } from './rest/index.js';

const bootstrap = async () => {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);

  const application = new RestApplication(config,logger);
  await application.init();
};

bootstrap();
