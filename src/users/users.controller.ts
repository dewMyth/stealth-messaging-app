import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('get-user-by-id')
  getUser() {
    return this.userService.getUser();
  }
}
