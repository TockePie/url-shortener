import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { JwtPayload, RequestWithUser } from '../../types/auth'

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>()

    try {
      const token = request.cookies?.['access_token']
      if (token) {
        const payload = await this.jwtService.verifyAsync<JwtPayload>(token)
        request.user = payload
      }
    } catch {
      request.user = null
    }

    request.creatorInfo = {
      userId: request.user?.sub || null,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    }

    return true
  }
}
