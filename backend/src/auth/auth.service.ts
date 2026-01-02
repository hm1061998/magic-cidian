import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { comparePasswords, hashPassword } from './utils/crypto.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  /**
   * Chạy sau khi toàn bộ ứng dụng và database đã sẵn sàng
   */
  async onApplicationBootstrap() {
    console.log('🔍 [GYSpace] Đang kiểm tra cấu hình hệ thống...');
    await this.seedAdmin();
  }

  /**
   * Tạo tài khoản admin mặc định nếu DB chưa có admin
   */
  private async seedAdmin() {
    try {
      // Kiểm tra xem đã có bất kỳ admin nào tồn tại chưa
      const adminExists = await this.userRepository.findOne({
        where: { isAdmin: true },
      });

      if (!adminExists) {
        // Lấy thông tin từ biến môi trường hoặc dùng giá trị mặc định an toàn
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        const hashedPassword = await hashPassword(adminPassword);

        const admin = this.userRepository.create({
          username: adminUsername,
          password: hashedPassword,
          isAdmin: true,
        });

        await this.userRepository.save(admin);

        console.log('--------------------------------------------------');
        console.log('🚀 GYSpace: Đã khởi tạo tài khoản Admin mặc định!');
        console.log(`👤 Username: ${adminUsername}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log('⚠️ Lưu ý: Hãy đổi mật khẩu ngay sau khi đăng nhập.');
        console.log('--------------------------------------------------');
      }
      console.log('✅ [GYSpace] Hệ thống đã sẵn sàng.');
    } catch (error) {
      console.error('❌ Lỗi khi khởi tạo tài khoản admin:', error);
    }
  }

  async register(username: string, pass: string) {
    if (!username || username.length < 4) {
      throw new BadRequestException('Tên đăng nhập phải có ít nhất 4 ký tự');
    }
    if (!pass || pass.length < 6) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 6 ký tự');
    }

    const existing = await this.userRepository.findOne({ where: { username } });
    if (existing) throw new ConflictException('Tên đăng nhập đã tồn tại');

    // Băm mật khẩu trước khi lưu
    const hashedPassword = await hashPassword(pass);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      isAdmin: false,
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async getTokens(
    userId: string,
    username: string,
    isAdmin: boolean,
    displayName?: string,
  ) {
    const payload = {
      username: username,
      sub: userId,
      isAdmin: isAdmin,
      displayName: displayName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m', // Access token expires in 15 minutes
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d', // Refresh token expires in 7 days
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async login(username: string, pass: string) {
    if (!username || username.length < 4 || !pass || pass.length < 6) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const user = await this.userRepository.findOne({ where: { username } });

    // So sánh mật khẩu đã băm
    if (user && (await comparePasswords(pass, user.password))) {
      const tokens = await this.getTokens(
        user.id,
        user.username,
        user.isAdmin,
        user.displayName,
      );
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          isAdmin: user.isAdmin,
        },
      };
    }
    throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
  }

  async logout(userId: string) {
    return this.userRepository.update(userId, { refreshToken: null });
  }

  async verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'isAdmin', 'refreshToken', 'displayName'],
    });

    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Truy cập bị từ chối');

    const refreshTokenMatches = await comparePasswords(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches)
      throw new UnauthorizedException('Truy cập bị từ chối');

    const tokens = await this.getTokens(
      user.id,
      user.username,
      user.isAdmin,
      user.displayName,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
