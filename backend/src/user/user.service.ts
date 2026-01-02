import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { comparePasswords, hashPassword } from '../auth/utils/crypto.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException(
        'Người dùng không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    return user;
  }

  async updateProfile(id: string, updateData: { displayName?: string }) {
    await this.userRepository.update(id, {
      displayName: updateData.displayName,
    });
    return this.findOne(id);
  }

  async changePassword(
    id: string,
    passData: { oldPass: string; newPass: string },
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!user)
      throw new HttpException(
        'Người dùng không tồn tại',
        HttpStatus.BAD_REQUEST,
      );

    const isMatch = await comparePasswords(passData.oldPass, user.password);
    if (!isMatch) throw new BadRequestException('Mật khẩu cũ không chính xác');

    if (passData.newPass.length < 6) {
      throw new BadRequestException('Mật khẩu mới phải có ít nhất 6 ký tự');
    }

    const hashedNewPass = await hashPassword(passData.newPass);
    await this.userRepository.update(id, { password: hashedNewPass });

    return { message: 'Đổi mật khẩu thành công' };
  }
}
