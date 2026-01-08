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
  Res,
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
import type { Response } from 'express'

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

  @Get()
  getMainMessage(@Res() res: Response) {
    res.set('Content-Type', 'text/html')
    res.send(`<!doctype html>
<html>
  <head>
    <title>URL Shortener</title>
    <meta charset="utf-8" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
  <body>
    <div class="m-3">
      <h1 class="text-2xl font-bold">URL Shortener</h1>
      <h3>
        Хілоу, на жаль тут нічого не має. Подивіться краще на мій
        GitHub-профіль:
        <a href="https://shu-gamma.vercel.app/qxmC89z" class="text-blue-500"
          >https://shu-gamma.vercel.app/qxmC89z</a
        >
        або спробуйте створити посилання власноруч
        <a
          href="https://shu-gamma.vercel.app/swagger#/Url/UrlController_createShortUrl"
          class="text-blue-500"
          >https://shu-gamma.vercel.app/swagger#/Url/UrlController_createShortUrl</a
        >
      </h3>
    </div>
  </body>
  <html></html>
</html>
`)
  }

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
