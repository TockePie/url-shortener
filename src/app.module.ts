import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Url } from './api/url/url.entity'
import { UrlModule } from './api/url/url.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Url],
      synchronize: true
    }),
    UrlModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
