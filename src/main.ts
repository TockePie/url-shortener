import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { TypeOrmExceptionFilter } from './config/typeorm.exception'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') ?? 3000

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useGlobalFilters(new TypeOrmExceptionFilter())
  app.use(cookieParser())

  await app.listen(port, () => {
    console.log(
      chalk.bgGreen.black(`The server is running on: http://localhost:${port}`)
    )
  })
}
bootstrap()
