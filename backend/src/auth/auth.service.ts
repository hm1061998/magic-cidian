
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(username: string, pass: string) {
    // Trong thực tế sẽ check DB, ở đây hardcode theo yêu cầu user
    if (username === 'admin' && pass === 'admin123') {
      const payload = { username: 'admin', sub: 'admin-uuid', role: 'ADMIN' };
      return {
        access_token: this.jwtService.sign(payload),
        user: { username: 'admin', role: 'ADMIN' }
      };
    }
    throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
  }
}
