import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { dataSourceOptions } from '../db/datasource'
import { AuthModule } from './api/auth/auth.module'
import { RateLimitModule } from './api/rate-limit/rate-limit.module'
import { UrlModule } from './api/url/url.module'
import { UsersModule } from './api/users/users.module'
import { validate } from './config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    // TypeOrmModule.forRootAsync({
    //   useClass: TypeOrmConfigService
    // }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UrlModule,
    UsersModule,
    RateLimitModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule {}
