import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger'
import type { Response } from 'express'

import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login' })
  @ApiOkResponse({
    description: 'Returns a success message',
    type: String,
    example: 'Login Successful!',
    headers: {
      'set-cookie': {
        description: 'Contains the access_token jwt',
        schema: {
          type: 'string',
          example:
            'access_token=abc123...; Path=/; HttpOnly; Secure; SameSite=Lax'
        }
      }
    }
  })
  @ApiException(() => new NotFoundException('User not found'), {
    description: 'Error: Not Found'
  })
  @ApiException(() => new UnauthorizedException("Password doesn't match"), {
    description: 'Error: Unauthorized'
  })
  @ApiException(
    () =>
      new BadRequestException([
        'username should not be empty',
        'password must be longer than or equal to 8 characters',
        'password should not be empty'
      ]),
    {
      description: 'Error: Bad Request'
    }
  )
  async logIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto
  ) {
    const user = await this.authService.validateUser(body)
    const { access_token } = await this.authService.logIn(user)

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    })

    return 'Login Successful!'
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Logout' })
  @ApiOkResponse({
    description: 'Returns a success message',
    type: String,
    example: 'Logged out successfully'
  })
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token')

    return 'Logged out successfully'
  }

  @Post('signup')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({
    description: 'Returns a success message',
    type: String,
    example: 'Account successfully created!',
    headers: {
      'set-cookie': {
        description: 'Contains the access_token jwt',
        schema: {
          type: 'string',
          example:
            'access_token=abc123...; Path=/; HttpOnly; Secure; SameSite=Lax'
        }
      }
    }
  })
  @ApiException(() => new ConflictException('Duplicate resource'), {
    description: 'Error: Conflict'
  })
  @ApiException(
    () =>
      new BadRequestException([
        'username should not be empty',
        'password must be longer than or equal to 8 characters',
        'password should not be empty'
      ]),
    {
      description: 'Error: Bad Request'
    }
  )
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto
  ) {
    const { access_token } = await this.authService.signUp(body)

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    })

    return 'Account successfully created!'
  }
}
