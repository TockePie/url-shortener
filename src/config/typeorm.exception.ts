import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { Request, Response } from 'express'
import { EntityNotFoundError, QueryFailedError } from 'typeorm'

interface DatabaseDriverError {
  code: string | number
  errno: number
  constraint: string
  detail: string
}

@Injectable()
@Catch(QueryFailedError, EntityNotFoundError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const res = context.getResponse<Response>()
    const req = context.getRequest<Request>()

    if (exception instanceof EntityNotFoundError) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        path: req.url,
        message: 'Entity not found'
      })
    }

    if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError as Partial<DatabaseDriverError>
      const code = driverError?.code || driverError?.errno

      const conflictCodes = ['23505', 19, 'SQLITE_CONSTRAINT']
      if (conflictCodes.includes(code as any)) {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          path: req.url,
          message: 'Duplicate resource',
          meta: driverError.constraint
            ? { constraint: driverError.constraint }
            : undefined
        })
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: req.url,
        message: 'Database query failed'
      })
    }

    throw new InternalServerErrorException()
  }
}
