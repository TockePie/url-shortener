import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './api/auth/auth.module'
import { RateLimitModule } from './api/rate-limit/rate-limit.module'
import { UrlModule } from './api/url/url.module'
import { UsersModule } from './api/users/users.module'
import { validate } from './config/env.validation'
import { TypeOrmConfigService } from './config/typeorm.config.service'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    UrlModule,
    UsersModule,
    RateLimitModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule {}
