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

import { Creator } from '../../config/decorators/create.decorator'
import { LoggerInterceptor } from '../../config/interceptors/logger.interceptor'
import type { CreatorInfo } from '../../types/auth'
import { OptionalAuthGuard } from '../auth/auth.guard'
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

  @UseGuards(OptionalAuthGuard)
  @Post('/shorten')
  createShortUrl(@Body() body: CreateUrlDto, @Creator() creator: CreatorInfo) {
    console.log(creator)
    return this.urlService.createShortUrl(body, creator)
  }
}
