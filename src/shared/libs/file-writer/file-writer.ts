import { createWriteStream } from 'node:fs';
import type { WriteStream } from 'node:fs';
import type { FileWriter } from './file-writer.interface.js';

export class TSVFileWriter implements FileWriter {
  private writeStream: WriteStream;

  constructor(private filePath: string) {
    this.writeStream = createWriteStream(
      this.filePath,
      {
        autoClose: true,
        encoding: 'utf-8',
        flags: 'w',
      }
    );
  }

  public async write(row: string): Promise<void> {
    const isWriteSuccessful = this.writeStream.write(`${row}\n`);

    if (!isWriteSuccessful) {
      return new Promise((resolve) => this.writeStream.once('drain', resolve));
    }
  }
}
