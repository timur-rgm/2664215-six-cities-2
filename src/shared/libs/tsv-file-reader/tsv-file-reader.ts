import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { FileReaderEvents } from '../../constants/index.js';
import type { FileReader } from './tsv-file-reader.interface.js';

const CHUNK_SIZE = 16384;

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly filePath: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filePath, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let partialRowData = '';
    let nextRowIndex = -1;
    let rowsCount = 0;

    for await (const chunk of readStream) {
      partialRowData += chunk.toString();

      while ((nextRowIndex = partialRowData.indexOf('\n')) >= 0) {
        const completeRow = partialRowData.slice(0, nextRowIndex + 1);
        partialRowData = partialRowData.slice(++nextRowIndex);
        rowsCount++;

        this.emit(FileReaderEvents.RowRead, completeRow);
      }
    }

    this.emit('end', rowsCount);
  }
}
