import { inject, injectable } from 'inversify';

import { Component } from '../../../types/index.js';
import { DEFAULT_STATIC_IMAGES, STATIC_RESOURCE_FIELDS } from './path-transformer.constants.js';
import { getFullServerPath } from '../../../helpers/index.js';
import { STATIC_DIRECTORY_ROUTE, UPLOAD_ROUTE } from '../../../../rest/index.js';
import type { Config, RestSchema } from '../../config/index.js';
import type { Logger } from '../../logger/index.js';

const isObject = (value: unknown): value is Record<string, object> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Config)
    private readonly config: Config<RestSchema>,

    @inject(Component.Logger)
    private readonly logger: Logger
  ) {
    this.logger.info('PathTransformer created!');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  private toStaticPath(value: string): string {
    const staticPath = STATIC_DIRECTORY_ROUTE;
    const uploadPath = UPLOAD_ROUTE;
    const serverHost = this.config.get('HOST');
    const serverPort = this.config.get('PORT');
    const rootPath = this.hasDefaultImage(value) ? staticPath : uploadPath;

    return `${getFullServerPath(serverHost, serverPort)}${rootPath}/${value}`;
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];

    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key)) {
            if (typeof value === 'string') {
              current[key] = this.toStaticPath(value);
            } else if (Array.isArray(value)) {
              current[key] = value
                .filter((item) => typeof item === 'string')
                .map((item) => this.toStaticPath(item));
            }
          }
        }
      }
    }

    return data;
  }
}
