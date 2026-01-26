import type { OfferEntity } from '../offer.entity.js';

export type OfferEntityWithIsFavorite = OfferEntity & { isFavorite: boolean };
