import { Request } from 'express'

export interface JwtPayload {
  sub: string
  username: string
}

export interface RequestWithUser extends Request {
  cookies: {
    access_token: string
  }

  user?: JwtPayload
}
