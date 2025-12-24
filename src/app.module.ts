import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './api/auth/auth.module'
import { UrlModule } from './api/url/url.module'
import { UsersModule } from './api/users/users.module'
import { TypeOrmConfigService } from './config/typeorm.config.service'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    UrlModule,
    UsersModule
  ]
})
export class AppModule {}
