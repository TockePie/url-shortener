import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UrlModule } from './api/url/url.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmConfigService } from './config/typeorm.config.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    UrlModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
