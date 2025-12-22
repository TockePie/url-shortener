import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common'

import { CreateUrlDto } from './dto/create-url.dto'
import { UrlService } from './url.service'

@Controller()
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Get('/:id')
  @Redirect()
  async redirectFromUrl(@Param('id') id: string) {
    const url = await this.urlService.redirectFromUrl(id)

    return { url }
  }

  @Post('/shorten')
  createShortUrl(@Body() body: CreateUrlDto) {
    return this.urlService.createShortUrl(body)
  }
}
