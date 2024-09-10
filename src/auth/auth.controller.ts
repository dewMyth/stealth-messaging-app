import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() newUser: any) {
    return this.authService.signUp(newUser);
  }

  @Post('login')
  login(@Body() loginCredentials: any) {
    return this.authService.signIn(loginCredentials);
  }
}
