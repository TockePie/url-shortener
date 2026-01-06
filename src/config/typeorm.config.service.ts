import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

import { RateLimit } from '../api/rate-limit/rate-limit.entity'
import { Url } from '../api/url/url.entity'
import { User } from '../api/users/user.entity'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('POSTGRES_HOST'),
      port: this.config.get<number>('DB_PORT'),
      username: this.config.get<string>('POSTGRES_USER'),
      password: this.config.get<string>('POSTGRES_PASSWORD'),
      database: this.config.get<string>('POSTGRES_DATABASE'),
      entities: [User, Url, RateLimit],
      migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrationsRun: false,
      retryAttempts: 3,
      retryDelay: 5000,
      synchronize: false
    }
  }
}
