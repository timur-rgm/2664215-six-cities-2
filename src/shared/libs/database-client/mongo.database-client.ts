import { inject, injectable } from 'inversify';
import * as Mongoose from 'mongoose';

import type { DatabaseClient } from './database-client.interface.js';
import type { Logger } from '../logger/index.js';
import { Component } from '../../types/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private connected = false;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {}

  public isConnected() {
    return this.connected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected()) {
      throw new Error('Already connected to MongoDB');
    }

    this.logger.info('Connecting to MongoDB...');
    this.mongoose = await Mongoose.connect(uri);
    this.connected = true;
    this.logger.info('Connected to MongoDB.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Not connected to MongoDB');
    }

    await this.mongoose.disconnect();
    this.connected = false;
    this.logger.info('Disconnected from MongoDB.');
  }
}
