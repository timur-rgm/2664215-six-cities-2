import type { DocumentType } from '@typegoose/typegoose';

import type { FavoriteEntity } from '../../favorite/index.js';
import type { OfferEntity } from '../offer.entity.js';

export const addIsFavoriteToOffers = (
  offers: OfferEntity[],
  favorites: DocumentType<FavoriteEntity>[],
): (OfferEntity & { isFavorite: boolean })[] => {
  const favoritesIds = favorites.map((favorite) => String(favorite.offerId));
  const favoriteIdsSet = new Set(favoritesIds);

  return offers.map((offer) => ({
    ...offer,
    isFavorite: favoriteIdsSet.has(offer.id),
  }));
};
