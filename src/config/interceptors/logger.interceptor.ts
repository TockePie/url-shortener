/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common'
import { Request } from 'express'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name)

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, body, query, params, headers } = request as Request
    const now = Date.now()

    return next.handle().pipe(
      tap((res: unknown) => {
        const responseTime = Date.now() - now
        this.logger.log(
          {
            method,
            url,
            body,
            query,
            params,
            headers,
            dateUTC: new Date(),
            responseTime
          },
          res
        )
      })
    )
  }
}
