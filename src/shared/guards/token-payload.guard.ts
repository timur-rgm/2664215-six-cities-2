import type { TokenPayload } from '../types/index.js';

export const isTokenPayload = (payload: unknown): payload is TokenPayload => (
  (typeof payload === 'object' && payload !== null) &&
  ('email' in payload && typeof payload.email === 'string') &&
  ('name' in payload && typeof payload.name === 'string') &&
  ('userId' in payload && typeof payload.userId === 'string')
);
