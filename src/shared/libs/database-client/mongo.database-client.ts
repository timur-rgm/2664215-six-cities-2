import { setTimeout } from 'node:timers/promises';
import { inject, injectable } from 'inversify';
import * as Mongoose from 'mongoose';

import type { DatabaseClient } from './database-client.interface.js';
import type { Logger } from '../logger/index.js';
import { Component } from '../../types/index.js';

const MAX_RETRY_COUNT = 5;
const RETRY_INTERVAL_MS = 1000;

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
    let currentAttempt = 1;

    while (currentAttempt <= MAX_RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.connected = true;
        this.logger.info('Connected to MongoDB.');
        return;
      } catch (error) {
        this.logger.error(
          `Failed to connect to MongoDB (attempt ${currentAttempt} of ${MAX_RETRY_COUNT})`,
          error as Error
        );
        currentAttempt++;
        await setTimeout(RETRY_INTERVAL_MS);
      }
    }

    throw new Error(`Unable to establish MongoDB connection after ${MAX_RETRY_COUNT} attempts`);
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
