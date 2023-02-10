import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './authDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: Pick<AuthDto,'email' |'password'>) {
    return this.authService.signIn(dto);
  }
}
