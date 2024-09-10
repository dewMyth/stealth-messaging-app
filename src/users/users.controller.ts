import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('get-user-by-id')
  getUser() {
    return this.userService.getUser();
  }

  @Post('verify-user')
  verifyUser(@Body() verifiedUserPayload) {
    return this.userService.verifyUser(verifiedUserPayload);
  }
}
