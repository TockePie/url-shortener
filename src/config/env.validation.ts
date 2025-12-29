import { Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator'

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development

  @IsNumber()
  PORT: number = 3000

  @IsString()
  DB_HOST: string

  @IsNumber()
  DB_PORT: number

  @IsString()
  DB_USER: string

  @IsString()
  DB_PASS: string

  @IsString()
  DB_NAME: string

  @IsString()
  JWT_SECRET: string

  @IsString()
  WEBSITE_URL: string
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
