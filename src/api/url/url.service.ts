import { Cache } from '@nestjs/cache-manager'
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { CreatorInfo } from '../../types/auth'
import generateShortCode from '../../utils/generate-short-code'
import prepareUrl from '../../utils/prepare-url'
import { RateLimitService } from '../rate-limit/rate-limit.service'
import { CreateUrlDto } from './dto/create-url.dto'
import { Url } from './url.entity'

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private repo: Repository<Url>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private configService: ConfigService,
    private rateLimitService: RateLimitService
  ) {}

  async createShortUrl(body: CreateUrlDto, creator: CreatorInfo) {
    const isAllowed = await this.rateLimitService.isAllowed(
      creator.userId ?? creator.ip ?? 'unknown',
      creator.userId ? 20 : 5
    )
    if (!isAllowed) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS)
    }

    const originalUrl = prepareUrl(body.url)
    const existing = await this.findByOriginalUrl(originalUrl)
    if (existing) return this.toResponse(existing)

    const shortUrl = await this.generateUniqueShortUrl()

    const expiresAt = creator.userId
      ? null
      : () => "CURRENT_TIMESTAMP + INTERVAL '1 day'"

    const entity = this.repo.create({
      originalUrl,
      shortUrl,
      userId: creator.userId,
      expiresAt
    })
    await this.repo.save(entity)
    await this.rateLimitService.createRecord(
      creator.userId ?? creator.ip ?? 'unknown',
      'create_url'
    )

    return this.toResponse(entity)
  }

  async redirectFromUrl(shortUrl: Url['shortUrl']): Promise<string> {
    const cache = await this.cacheManager.get(shortUrl)
    if (cache) return cache as unknown as string

    const url = await this.findByShortUrl(shortUrl)
    if (!url) throw new NotFoundException('Url not found')

    const date = await this.fetchCurrentTimestamp()
    if (url.expiresAt && url.expiresAt < date) {
      throw new NotFoundException('This URL has expired.')
    }

    await this.cacheManager.set(shortUrl, url.originalUrl)

    return url.originalUrl
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'fetch-database'
  })
  async fetchAllUrl() {
    return this.repo.find()
  }

  private async fetchCurrentTimestamp() {
    const date: { now: Date }[] = await this.repo.query(
      'SELECT CURRENT_TIMESTAMP as now'
    )
    return date[0].now
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
      shortUrl: this.prepareShortUrl(url.shortUrl),
      expiresAt: url.expiresAt
    }
  }

  private prepareShortUrl(shortUrl: string) {
    const webUrl = this.configService.get<string>('WEBSITE_URL')
    if (!webUrl) return shortUrl

    return `${webUrl}/${shortUrl}`
  }
}
