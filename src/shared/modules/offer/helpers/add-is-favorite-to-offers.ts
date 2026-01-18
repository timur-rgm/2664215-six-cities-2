import type { DocumentType } from '@typegoose/typegoose';

import type { FavoriteEntity } from '../../favorite/index.js';
import type { OfferEntity } from '../offer.entity.js';
import type { OfferEntityWithIsFavorite } from '../types/offer-entity-with-favorite.type.js';

export const addIsFavoriteToOffers = (
  offers: OfferEntity[],
  favorites: DocumentType<FavoriteEntity>[],
): OfferEntityWithIsFavorite[] => {
  const favoritesIds = favorites.map((favorite) => String(favorite.offerId));
  const favoriteIdsSet = new Set(favoritesIds);

  return offers.map((offer) => ({
    ...offer,
    isFavorite: favoriteIdsSet.has(offer.id),
  }));
};
