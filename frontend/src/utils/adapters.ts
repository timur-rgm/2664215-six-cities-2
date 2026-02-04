import { CityLocation, UserType } from '../const';
import type { Offer, Comment, User, CityName } from '../types/types';
import type { OfferDto } from '../dto/offer/offer.dto';
import type { UserDto } from '../dto/user/user.dto';
import type { CommentDto } from '../dto/comment/comment.dto';

const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  type: user.type === 'pro' ? UserType.Pro : UserType.Regular,
});

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: offer.city as CityName,
    location: CityLocation[offer.city as CityName],
  },
  location: offer.location,
  previewImage: offer.previewImage,
  type: offer.type,
  bedrooms: offer.bedrooms,
  description: offer.description,
  goods: offer.amenities,
  host: adaptUserToClient(offer.user as UserDto),
  images: offer.images,
  maxAdults: offer.maxAdults,
});

export const adaptOffersToClient = (offers: OfferDto[]): Offer[] =>
  offers.map(adaptOfferToClient);

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: 'tmp', // временно, т.к. CommentRdo не отдаёт id
  comment: comment.text,
  date: comment.createdAt ?? new Date().toISOString(),
  rating: comment.rating,
  user: adaptUserToClient(comment.user as UserDto),
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments.map(adaptCommentToClient);
