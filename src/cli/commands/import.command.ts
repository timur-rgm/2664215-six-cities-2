import { TSVFileReader } from '../../shared/libs/index.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import type { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private onRowRead(row: string) {
    const offer = createOffer(row);
    console.info(offer);
  }

  private onReadEnd(rowsCount: number) {
    console.info(`${rowsCount} rows imported.`);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...params: string[]): Promise<void> {
    const [filePath] = params;
    const fileReader = new TSVFileReader(filePath);

    fileReader.on('rowRead', this.onRowRead);
    fileReader.on('end', this.onReadEnd);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filePath}`);
      console.error(getErrorMessage(error));
    }
  }
}
