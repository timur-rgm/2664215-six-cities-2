import type { TokenPayload } from './src/shared/types/index.js';

declare module 'express-serve-static-core' {
  export interface Locals {
    tokenPayload?: TokenPayload;
  }
}
