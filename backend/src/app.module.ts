/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  IdiomEntity,
  CharacterAnalysisEntity,
  ExampleSentenceEntity,
} from './idioms/entities/idiom.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { IdiomsModule } from './idioms/idioms.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const isProd = process.env.NODE_ENV === 'production';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'ballast.proxy.rlwy.net',
        port: parseInt(process.env.DB_PORT || '52331'),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'yzboxmbzJXGmzXyrblpeKTiyMdWAqaTF',
        database: process.env.DB_NAME || 'railway',
        entities: [IdiomEntity, CharacterAnalysisEntity, ExampleSentenceEntity],
        synchronize: true, // Lưu ý: Chỉ dùng true cho môi trường Dev để tự tạo bảng
      }),
      inject: [ConfigService],
    }),
    IdiomsModule,
    UserModule,
    ...(isProd
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public', 'dist'),
            exclude: ['/api'],
          }),
        ]
      : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
