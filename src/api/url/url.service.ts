import { Cache } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import generateShortCode from '../../utils/generate-short-code'
import prepareUrl from '../../utils/prepare-url'
import { CreateUrlDto } from './dto/create-url.dto'
import { Url } from './url.entity'

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private repo: Repository<Url>,
    private configService: ConfigService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  async createShortUrl(body: CreateUrlDto) {
    const originalUrl = prepareUrl(body.url)
    const existing = await this.findByOriginalUrl(originalUrl)
    if (existing) return this.toResponse(existing)

    const shortUrl = await this.generateUniqueShortUrl()

    const entity = this.repo.create({ originalUrl, shortUrl })
    await this.repo.save(entity)

    return this.toResponse(entity)
  }

  async redirectFromUrl(shortUrl: Url['shortUrl']): Promise<string> {
    const cache = await this.cacheManager.get(shortUrl)
    if (cache) return cache as unknown as string

    const url = await this.findByShortUrl(shortUrl)
    if (!url) throw new NotFoundException('Url not found')

    await this.cacheManager.set(shortUrl, url.originalUrl)

    return url.originalUrl
  }

  private async findByOriginalUrl(originalUrl: string) {
    return this.repo.findOne({ where: { originalUrl } })
  }

  private async findByShortUrl(shortUrl: string) {
    return this.repo.findOne({ where: { shortUrl } })
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
      shortUrl: this.prepareShortUrl(url.shortUrl)
    }
  }

  private prepareShortUrl(shortUrl: string) {
    const webUrl = this.configService.get<string>('WEBSITE_URL')
    if (!webUrl) return shortUrl

    return `${webUrl}/${shortUrl}`
  }
}
