import { appendFile } from 'node:fs/promises';
import got from 'got';
import { TSVOfferGenerator } from '../../shared/lib/index.js';
import type { MockServerData } from '../../shared/types/index.js';
import type { Command } from './command.interface.js';

export class GenerateCommand implements Command {
  private data: MockServerData;

  private async loadMockData(url: string): Promise<void> {
    try {
      this.data = await got.get(url).json<MockServerData>();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offersCount: number): Promise<void> {
    const tsvOfferGenerator = new TSVOfferGenerator(this.data);

    for (let i = 0; i < offersCount; i++) {
      await appendFile(
        filepath,
        `${tsvOfferGenerator.generate()}\n`,
        { encoding: 'utf-8'}
      );
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...params: string[]): Promise<void> {
    const [count, filepath, url] = params;
    const offersCount = Number.parseInt(count, 10);

    try {
      await this.loadMockData(url);
      await this.write(filepath, offersCount);
      console.info(`File ${filepath} was created!`);
    } catch (error) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
