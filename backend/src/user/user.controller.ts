import { Controller, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('profile')
  async updateProfile(@Req() req, @Body() body: { displayName: string }) {
    return this.userService.updateProfile(req.user.id, body);
  }

  @Put('change-password')
  async changePassword(
    @Req() req,
    @Body() body: { oldPass: string; newPass: string },
  ) {
    return this.userService.changePassword(req.user.id, body);
  }
}
