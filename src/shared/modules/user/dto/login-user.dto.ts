import { IsEmail, IsString, } from 'class-validator';
import { LoginUserValidationMessage } from './login-user.validation.messages.js';

export class LoginUserDto {
  @IsEmail({}, {
    message: LoginUserValidationMessage.email.format
  })
  public email: string;

  @IsString({
    message: LoginUserValidationMessage.password.type
  })
  public password: string;
}
