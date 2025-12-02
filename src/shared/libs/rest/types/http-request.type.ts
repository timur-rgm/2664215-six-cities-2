import type { Request } from 'express';

export type RequestWithBody<T> = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  T
>
