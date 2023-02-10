import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  @ValidateIf((payload) => payload.email == undefined || payload.phone)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((payload) => payload.userName == undefined || payload.email)
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
