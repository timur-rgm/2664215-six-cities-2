import type { Request } from 'express';

export type TypedRequest<
  TBody = unknown,
  TParams = Record<string, unknown>,
  TQuery = Record<string, unknown>
> = Request<TParams, unknown, TBody, TQuery>;

export type RequestWithBody<TBody> =
  TypedRequest<TBody>;

export type RequestWithParams<TParams> =
  TypedRequest<undefined, TParams>;

export type RequestWithQuery<TQuery> =
  TypedRequest<undefined, Record<string, unknown>, TQuery>;


