import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Command } from './command.interface.js';

type PackageJSONConfigType = {
  version: string
};

export const isPackageJSONConfig = (value: unknown): value is PackageJSONConfigType => (
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.hasOwn(value,'version')
);

export class VersionCommand implements Command {
  constructor(private readonly filePath: string = './package.json') {}

  private readVersion(): string {
    const file = readFileSync(resolve(this.filePath), { encoding: 'utf8' });
    const parsedFile: unknown = JSON.parse(file);

    if (!isPackageJSONConfig(parsedFile)) {
      throw new Error('Failed to parse json content.');
    }

    return parsedFile.version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._params: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(version);
    } catch (error) {
      console.error(`Failed to read version from ${this.filePath}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
