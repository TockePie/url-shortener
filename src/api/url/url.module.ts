import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LoggerInterceptor } from '../../config/interceptors/logger.interceptor'
import { AuthModule } from '../auth/auth.module'
import { UrlController } from './url.controller'
import { Url } from './url.entity'
import { UrlService } from './url.service'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL')
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Url]),
    AuthModule
  ],
  controllers: [UrlController],
  providers: [UrlService, LoggerInterceptor]
})
export class UrlModule {}
