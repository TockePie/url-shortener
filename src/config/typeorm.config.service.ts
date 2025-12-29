import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProd = this.config.get('NODE_ENV') === 'production'

    const PG_CONFIG = {
      host: this.config.get<string>('DB_HOST'),
      port: this.config.get<number>('DB_PORT'),
      username: this.config.get<string>('DB_USER'),
      password: this.config.get<string>('DB_PASS'),
      database: this.config.get<string>('DB_NAME')
    }

    const SQLITE_CONFIG = { database: 'db.sqlite' }

    return {
      type: isProd ? 'postgres' : 'sqlite',
      ...(isProd ? PG_CONFIG : SQLITE_CONFIG),
      autoLoadEntities: true,
      synchronize: !isProd
    }
  }
}
