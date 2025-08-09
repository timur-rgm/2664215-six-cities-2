import { config } from 'dotenv';
import type { DotenvParseOutput} from 'dotenv';
import type { Config } from './config.interface.js';
import type { Logger } from '../logger/index.js';

export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;

  constructor(private readonly logger: Logger) {
    const dotenvConfig = config();

    if (dotenvConfig.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    this.config = dotenvConfig.parsed as DotenvParseOutput;
    this.logger.info('.env file found and successfully parsed!');
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
