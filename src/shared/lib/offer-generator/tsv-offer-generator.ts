import dayjs from 'dayjs';
import {
  getRandomNumber,
  getRandomBoolean,
  getRandomArrayItem,
  getRandomArrayItems
} from '../random.js';
import * as constants from './constants.js';
import type { OfferGenerator } from './offer-generator.interface.js';
import type { MockServerData } from '../../types/index.js';

export class TsvOfferGenerator implements OfferGenerator {
  constructor(private readonly mockServerData: MockServerData) {}

  public generate(): string {
    const title = getRandomArrayItem(this.mockServerData.titles);
    const description = getRandomArrayItem(this.mockServerData.descriptions);
    const previewImage = getRandomArrayItem(this.mockServerData.previewImages);
    const images = this.mockServerData.images.join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = getRandomNumber(constants.MIN_RATING, constants.MAX_RATING, 1);
    const type = getRandomArrayItem(this.mockServerData.types);
    const bedrooms = getRandomNumber(constants.MIN_BEDROOMS, constants.MAX_BEDROOMS);
    const maxAdults = getRandomNumber(constants.MIN_ADULTS, constants.MAX_ADULTS);
    const price = getRandomNumber(constants.MIN_PRICE, constants.MAX_PRICE);
    const amenities = getRandomArrayItems(this.mockServerData.amenities).join(';');
    const host = getRandomArrayItem(this.mockServerData.hosts);
    const commentCount = getRandomNumber(constants.MIN_COMMENTS_COUNT, constants.MAX_COMMENTS_COUNT);

    const location = [
      getRandomNumber(constants.MIN_COORDINATE, constants.MAX_COORDINATE, 6),
      getRandomNumber(constants.MIN_COORDINATE, constants.MAX_COORDINATE, 6)
    ].join(';');

    const createdAt = dayjs()
      .subtract(getRandomNumber(constants.MIN_DAYS_AGO, constants.MAX_DAYS_AGO), 'day')
      .toISOString();

    return [
      title,
      description,
      createdAt,
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
    ].join('\t');
  }
}
