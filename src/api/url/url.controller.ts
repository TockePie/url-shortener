import { Body, Controller, Post } from '@nestjs/common'

import { CreateUrlDto } from './dto/create-url.dto'
import { UrlService } from './url.service'

@Controller('/url')
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post('/shorten')
  createShortUrl(@Body() body: CreateUrlDto) {
    return this.urlService.createShortUrl(body)
  }
}
