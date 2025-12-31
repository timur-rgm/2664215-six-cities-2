import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { CreateUserValidationMessage } from './create-user.validation.messages.js';
import { UserRole } from '../../../types/index.js';

export class CreateUserDto {
  @IsString({
    message: CreateUserValidationMessage.name.type
  })
  @Length(1, 15, {
    message: CreateUserValidationMessage.name.length
  })
  public name: string;

  @IsEmail({}, {
    message: CreateUserValidationMessage.email.format
  })
  public email: string;

  @IsString({
    message: CreateUserValidationMessage.password.type
  })
  @Length(6, 12, {
    message: CreateUserValidationMessage.password.length
  })
  public password: string;

  @IsOptional()
  @IsString({
    message: CreateUserValidationMessage.avatarPath.type
  })
  public avatarUrl?: string;

  @IsEnum(UserRole, {
    message: CreateUserValidationMessage.type.type
  })
  public type: UserRole;
}
