import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signUp(): string {
    return 'This is signup';
  }

  signIn(): string {
    return 'This is signin';
  }
}
