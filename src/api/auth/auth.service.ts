import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { User } from '../users/user.entity'
import { UsersService } from '../users/users.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser({ username, password }: AuthDto) {
    const user = await this.usersService.findOne(username)
    if (!user) throw new NotFoundException('User not found')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException("Password doesn't match")

    return user
  }

  async logIn(user: User) {
    return await this.getToken(user)
  }

  async signUp({ username, password }: AuthDto) {
    const user = await this.usersService.create(username, password)

    return await this.getToken(user)
  }

  private async getToken(user: User) {
    const payload = { sub: user.id, username: user.username }
    const access_token = await this.jwtService.signAsync(payload)

    return { access_token }
  }
}
