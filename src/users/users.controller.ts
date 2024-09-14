import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('get-user-by-id/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post('verify-user')
  verifyUser(@Body() verifiedUserPayload) {
    return this.userService.verifyUser(verifiedUserPayload);
  }
}
