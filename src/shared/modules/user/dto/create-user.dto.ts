import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

import { CreateUserValidationMessage } from './create-user.validation.messages.js';
import { UserRole } from '../../../types/index.js';

export class CreateUserDto {
  @MinLength(1, {
    message: CreateUserValidationMessage.name.minLength
  })
  @MaxLength(15, {
    message: CreateUserValidationMessage.name.maxLength
  })
  public name: string;

  @IsEmail({}, {
    message: CreateUserValidationMessage.email.format
  })
  public email: string;

  @MinLength(6, {
    message: CreateUserValidationMessage.password.minLength
  })
  @MaxLength(12, {
    message: CreateUserValidationMessage.password.maxLength
  })
  public password: string;

  @IsString({
    message: CreateUserValidationMessage.avatarPath.type
  })
  public avatarUrl?: string;

  @IsEnum(UserRole, {
    message: CreateUserValidationMessage.type.type
  })
  public type: UserRole;
}
