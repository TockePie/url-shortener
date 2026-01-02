import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res
} from '@nestjs/common'
import type { Response } from 'express'

import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async logIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto
  ) {
    const userBody = await this.authService.validateUser(body)
    const { access_token } = await this.authService.logIn(userBody)

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
    res.send('Login Successful!')
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token')
    res.send('Logged out successfully')
  }

  @Post('signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto
  ) {
    const { access_token } = await this.authService.signUp(body)

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
    res.send('Account successfully created!')
  }
}
