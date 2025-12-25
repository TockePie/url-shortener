import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { User } from '../users/user.entity'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username)
    if (!user) throw new NotFoundException()

    const hash = await bcrypt.compare(pass, user.password)
    if (!hash) throw new UnauthorizedException()

    return await this.getToken(user)
  }

  async signUp(username: string, password: string) {
    const user = await this.usersService.create(username, password)

    return await this.getToken(user)
  }

  private async getToken(user: User) {
    const payload = { sub: user.id, username: user.username }
    const access_token = await this.jwtService.signAsync(payload)

    return { access_token }
  }
}
