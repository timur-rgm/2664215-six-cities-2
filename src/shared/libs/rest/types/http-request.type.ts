import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

export type TypedRequest<
  TBody = unknown,
  TParams = Record<string, unknown>,
  TQuery = Record<string, unknown>
> = Request<TParams, unknown, TBody, TQuery>;

export type RequestWithBody<TBody> =
  TypedRequest<TBody>;

export type RequestWithParams<TParams> =
  TypedRequest<undefined, TParams | ParamsDictionary>;

export type RequestWithBodyAndParams<TBody, TParams> =
  TypedRequest<TBody, TParams | ParamsDictionary>;

export type RequestWithQuery<TQuery> =
  TypedRequest<undefined, Record<string, unknown>, TQuery>;


