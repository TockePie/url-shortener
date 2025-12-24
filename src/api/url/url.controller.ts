import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'

import { LoggerInterceptor } from '../../config/interceptors/logger.interceptor'
import { AuthGuard } from '../auth/auth.guard'
import { CreateUrlDto } from './dto/create-url.dto'
import { UrlService } from './url.service'

@UseInterceptors(LoggerInterceptor)
@Controller()
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Get('/:id')
  @Redirect()
  async redirectFromUrl(@Param('id') id: string) {
    const url = await this.urlService.redirectFromUrl(id)

    return { url }
  }

  /*TODO: Make possibility to create a short URLs to users
  without authorization for 24h. Implement rate limiting 
  */
  @UseGuards(AuthGuard)
  @Post('/shorten')
  createShortUrl(@Body() body: CreateUrlDto) {
    return this.urlService.createShortUrl(body)
  }
}
