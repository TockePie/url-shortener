import { Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync
} from 'class-validator'

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV

  @IsNumber()
  PORT: number = 3000

  @IsString()
  POSTGRES_HOST: string

  @IsNumber()
  DB_PORT: number

  @IsString()
  POSTGRES_USER: string

  @IsString()
  POSTGRES_PASSWORD: string

  @IsString()
  POSTGRES_DATABASE: string

  @IsString()
  WEBSITE_URL: string

  @IsNumber()
  CACHE_TTL: number = 300000

  @IsNumber()
  @Min(1)
  @Max(20)
  BCRYPT_HASH_ROUNDS: number = 10

  @IsString()
  JWT_SECRET: string
}

const NAME = 'EnvironmentValidator'
const logger = new Logger(NAME)

export function validate(config: Record<string, unknown>): Record<string, any> {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  })

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    logger.fatal(`Config validation error: ${errors.toString()}`)
    throw new Error('Environment validation failed')
  }

  return validatedConfig
}
