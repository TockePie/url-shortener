import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestWithUser } from 'src/types/auth'

export const Creator = createParamDecorator(
  (_data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    return request.creatorInfo
  }
)
