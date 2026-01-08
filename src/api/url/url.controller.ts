import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Redirect,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity
} from '@nestjs/swagger'

import { Creator } from '../../config/decorators/create.decorator'
import { LoggerInterceptor } from '../../config/interceptors/logger.interceptor'
import type { CreatorInfo } from '../../types/auth'
import { OptionalAuthGuard } from '../auth/auth.guard'
import { CreateUrlDto } from './dto/create-url.dto'
import { UrlResponseDto } from './dto/url-response.dto'
import { UrlService } from './url.service'

@Controller()
@UseInterceptors(LoggerInterceptor)
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Get('/:code')
  @Redirect()
  @ApiOperation({ summary: 'Use short URL to be redirected to longer URL' })
  @ApiParam({
    name: 'code',
    description: 'Insert a shortened code to redirect to longer URL.'
  })
  @ApiFoundResponse({
    description: 'Found. Redirecting to {longerUrl}'
  })
  @ApiException(() => new NotFoundException('Url not found'), {
    description: 'Error: Not Found'
  })
  @ApiException(() => new NotFoundException('This URL has expired.'), {
    description: 'Error: Not Found'
  })
  async redirectFromUrl(@Param('code') code: string) {
    const url = await this.urlService.redirectFromUrl(code)

    return { url }
  }

  @Post('/shorten')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Create a short URL' })
  @ApiBody({ type: CreateUrlDto })
  @ApiSecurity('access_token', [])
  @ApiCreatedResponse({
    type: UrlResponseDto
  })
  @ApiException(
    () => new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS)
  )
  createShortUrl(@Body() body: CreateUrlDto, @Creator() creator: CreatorInfo) {
    return this.urlService.createShortUrl(body, creator)
  }
}
