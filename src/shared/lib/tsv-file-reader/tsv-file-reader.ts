import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { FileReader } from './tsv-file-reader.interface.js';
import { Amenity, City, Coordinates, HousingType, OfferType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  constructor(private readonly filePath: string) {}

  private parseBoolean(value: string): boolean {
    return value === 'true';
  }

  private parseNumber(value: string): number {
    return Number.parseInt(value, 10);
  }

  private parseArray(value: string): string[] {
    return value.split(';');
  }

  private parseLocation(value: string): Coordinates {
    const [latitude, longitude] = this.parseArray(value);

    return {
      latitude: this.parseNumber(latitude),
      longitude: this.parseNumber(longitude),
    };
  }

  public read(): string {
    return readFileSync(resolve(this.filePath), { encoding: 'utf8' });
  }

  public toArray(fileContent: string): OfferType[] {
    return fileContent
      .split('/n')
      .filter((row) => !!row.trim().length)
      .map((row) => row.split('/t'))
      .map(([
        title,
        description,
        createdAt,
        city,
        previewImage,
        images,
        isPremium,
        isFavorite,
        rating,
        type,
        bedrooms,
        maxAdults,
        price,
        amenities,
        host,
        commentCount,
        location
      ]) => ({
        title,
        description,
        createdAt,
        previewImage,
        host,
        city: city as City,
        type: type as HousingType,
        images: this.parseArray(images),
        isPremium: this.parseBoolean(isPremium),
        isFavorite: this.parseBoolean(isFavorite),
        rating: this.parseNumber(rating),
        bedrooms: this.parseNumber(bedrooms),
        maxAdults: this.parseNumber(maxAdults),
        price: this.parseNumber(price),
        commentCount: this.parseNumber(commentCount),
        location: this.parseLocation(location),
        amenities: this.parseArray(amenities) as Amenity[],
      }));
  }
}
