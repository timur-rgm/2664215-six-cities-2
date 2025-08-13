import { injectable, inject } from 'inversify';
import type { Config, RestSchema } from '../shared/libs/config/index.js';
import type { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
