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
import { SignInDto } from './dto/sign-in.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignInDto
  ) {
    const userBody = await this.authService.validateUser(
      body.username,
      body.password
    )
    const { access_token } = await this.authService.logIn(userBody)

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
    res.send('Login Successful!')
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token')

    return 'Logged out successfully'
  }

  @Post('signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignInDto
  ) {
    const { access_token } = await this.authService.signUp(
      body.username,
      body.password
    )

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
    res.send('Account successfully created!')
  }
}
