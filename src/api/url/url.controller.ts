import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common'
import type { Response } from 'express'

import { CreateUrlDto } from './dto/create-url.dto'
import { UrlService } from './url.service'

@Controller()
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Get('/:id')
  async redirectFromUrl(@Res() res: Response, @Param('id') id: string) {
    const redirectUrl = await this.urlService.redirectFromUrl(id)

    res.redirect(redirectUrl)
  }

  @Post('/shorten')
  createShortUrl(@Body() body: CreateUrlDto) {
    return this.urlService.createShortUrl(body)
  }
}
