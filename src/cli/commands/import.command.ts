import { TSVFileReader } from '../../shared/lib/tsv-file-reader/index.js';
import type { Command } from './command.interface.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...params: string[]): Promise<void> {
    const [filePath] = params;
    const fileReader = new TSVFileReader(filePath);

    try {
      const fileContent = await fileReader.read();
      const offers = fileReader.toArray(fileContent);
      console.log(offers);
    } catch (error) {
      console.error(`Can't import data from file: ${filePath}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
