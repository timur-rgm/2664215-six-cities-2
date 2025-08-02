import got from 'got';
import type { Command } from './command.interface.js';
import type { MockServerData } from '../../shared/types/index.js';

export class GenerateCommand implements Command {
  static async fetchMockData(url: string): Promise<MockServerData> {
    try {
      return await got.get(url).json<MockServerData>();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...params: string[]): Promise<void> {
    const [count, filepath, url] = params;
    const offersCount = Number.parseInt(count, 10);

    try {
      const mockData = await GenerateCommand.fetchMockData(url);
    } catch (error) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
