import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { adaptOfferToClient, adaptOffersToClient, adaptCommentsToClient } from '../utils/adapters';
import { adaptCreateOfferToServer, adaptUpdateOfferToServer } from '../utils/adapters-to-server';
import type { CreateOfferDto } from '../dto/offer/create-offer.dto';
import type { UpdateOfferDto } from '../dto/offer/update-offer.dto';
import type { OfferDto } from '../dto/offer/offer.dto';
import type { CommentDto } from '../dto/comment/comment.dto';
import type { UserDto } from '../dto/user/user.dto';
import type { LoggedUserDto } from '../dto/user/logged-user.dto';
import type { UserAuth, User, Offer, Comment, CommentAuth, FavoriteAuth, UserRegister, NewOffer } from '../types/types';
import { ApiRoute, AppRoute, HttpCode } from '../const';
import { Token } from '../utils';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(ApiRoute.Offers);
    return adaptOffersToClient(data);
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(`${ApiRoute.Favorite}?isFavorite=true`);
    return adaptOffersToClient(data);
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferDto>(`${ApiRoute.Offers}/${id}`);
      return adaptOfferToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<OfferDto>(ApiRoute.Offers, adaptCreateOfferToServer(newOffer));
    const offerId = data.id;
    if (newOffer.previewImageFile) {
      const previewData = new FormData();
      previewData.append('preview', newOffer.previewImageFile);
      await api.post(`${ApiRoute.Offers}/${offerId}/preview`, previewData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    if (newOffer.imagesFiles && newOffer.imagesFiles.length === 6) {
      const imagesData = new FormData();
      newOffer.imagesFiles.forEach((file) => imagesData.append('images', file));
      await api.post(`${ApiRoute.Offers}/${offerId}/images`, imagesData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(`${AppRoute.Property}/${data.id}`);
    return adaptOfferToClient(data);
  });

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.patch<OfferDto>(`${ApiRoute.Offers}/${offer.id}`, adaptUpdateOfferToServer(offer));
    if (offer.previewImageFile) {
      const previewData = new FormData();
      previewData.append('preview', offer.previewImageFile);
      await api.post(`${ApiRoute.Offers}/${offer.id}/preview`, previewData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    if (offer.imagesFiles && offer.imagesFiles.length === 6) {
      const imagesData = new FormData();
      offer.imagesFiles.forEach((file) => imagesData.append('images', file));
      await api.post(`${ApiRoute.Offers}/${offer.id}/images`, imagesData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(`${AppRoute.Property}/${data.id}`);
    return adaptOfferToClient(data);
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(`${ApiRoute.Premium}?city=${cityName}&isPremium=true`);
    return adaptOffersToClient(data);
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<CommentDto[]>(`${ApiRoute.Offers}/${id}${ApiRoute.Comments}`);
    return adaptCommentsToClient(data);
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<UserDto>(ApiRoute.Login);
      return data.email;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<LoggedUserDto>(ApiRoute.Login, { email, password });
    Token.save(data.token);
    history.push(AppRoute.Root);
    return data.email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async () => {
    Token.drop();
  }
);

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, type }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<{ id: string }>(ApiRoute.Register, {
      email,
      password,
      name,
      type,
    });
    if (avatar) {
      const payload = new FormData();
      payload.append('avatarUrl', avatar);
      await api.post(`${ApiRoute.Avatar}/${data.id}/avatar`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(AppRoute.Login);
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ offerId, comment, rating }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<Comment>(ApiRoute.Comments, { text: comment, rating, offerId });

    return data;
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.put<Offer>(`${ApiRoute.Favorite}/${id}/favorite`);

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.delete<Offer>(`${ApiRoute.Favorite}/${id}/favorite`);

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});
