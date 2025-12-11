import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';

export const getErrorMessage = (error: unknown): string | null => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return null;
};

export const fillRdo = <T, V>(rdoClass: ClassConstructor<T>, data: V) =>
  plainToInstance(rdoClass, data, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message
});

