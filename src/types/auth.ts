import { Request } from 'express'

export interface CreatorInfo {
  userId: JwtPayload['sub'] | null
  ip?: string
  userAgent?: string
}

export interface JwtPayload {
  sub: string
  username: string
}

export interface RequestWithUser extends Request {
  cookies: {
    access_token: string
  }

  user?: JwtPayload | null

  creatorInfo: CreatorInfo
}
