import { config } from 'dotenv';
import { restConfigSchema } from './rest.schema.js';
import type { RestSchema } from './rest.schema.js';
import type { Config } from './config.interface.js';
import type { Logger } from '../logger/index.js';

export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(private readonly logger: Logger) {
    const dotenvConfig = config();

    if (dotenvConfig.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    restConfigSchema.load({});
    restConfigSchema.validate({ allowed: 'strict', output: this.logger.info });
    this.config = restConfigSchema.getProperties();

    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
