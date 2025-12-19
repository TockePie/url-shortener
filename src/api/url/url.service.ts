import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import generateShortCode from '../../utils/generate-short-code'
import prepareUrl from '../../utils/prepare-url'
import { CreateUrlDto } from './dto/create-url.dto'
import { Url } from './url.entity'

@Injectable()
export class UrlService {
  constructor(@InjectRepository(Url) private repo: Repository<Url>) {}

  async createShortUrl(body: CreateUrlDto) {
    const originalUrl = prepareUrl(body.url)
    const existing = await this.findByOriginalUrl(originalUrl)
    if (existing) this.toResponse(existing)

    const shortUrl = await this.generateUniqueShortUrl()

    const entity = this.repo.create({ originalUrl, shortUrl })
    await this.repo.save(entity)

    return this.toResponse(entity)
  }

  private async findByOriginalUrl(originalUrl: string): Promise<Url | null> {
    return this.repo.findOne({ where: { originalUrl } })
  }

  private async generateUniqueShortUrl() {
    let shortUrl: string
    let collision: Url | null

    do {
      shortUrl = generateShortCode()
      collision = await this.repo.findOne({
        where: { shortUrl }
      })
    } while (collision)

    return shortUrl
  }

  private toResponse(url: Url): DeepPartial<Url> {
    return {
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl
    }
  }
}
