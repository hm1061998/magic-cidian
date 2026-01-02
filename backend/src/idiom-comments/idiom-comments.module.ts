import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdiomCommentsController } from './idiom-comments.controller';
import { IdiomCommentsService } from './idiom-comments.service';
import { IdiomCommentEntity } from './entities/idiom-comment.entity';
import { IdiomEntity } from '../idioms/entities/idiom.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IdiomCommentEntity, IdiomEntity, UserEntity]),
  ],
  controllers: [IdiomCommentsController],
  providers: [IdiomCommentsService],
  exports: [IdiomCommentsService],
})
export class IdiomCommentsModule {}
