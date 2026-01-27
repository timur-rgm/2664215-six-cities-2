import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { ValidationError } from 'class-validator';

import type { ValidationErrorField } from '../../rest/types/index.js';

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

export const parseBooleanString = (value?: string): boolean | undefined => {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
};

export const reduceValidationErrors = (
  errors: ValidationError[]
): ValidationErrorField[] =>
  errors.map(({ property, value, constraints}) => ({
    property,
    value,
    messages : constraints ? Object.values(constraints) : []
  }));
