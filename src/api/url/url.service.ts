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
import { Repository } from 'typeorm'

import { CreatorInfo } from '../../types/auth'
import generateShortCode from '../../utils/generate-short-code'
import prepareUrl from '../../utils/prepare-url'
import { RateLimitService } from '../rate-limit/rate-limit.service'
import { CreateUrlDto } from './dto/create-url.dto'
import { UrlResponseDto } from './dto/url-response.dto'
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
    await this.checkRateLimit(creator)

    const originalUrl = prepareUrl(body.url)
    const existing = await this.findByOriginalUrl(originalUrl)
    if (existing) {
      return this.updateExistingUrl(creator, existing)
    }

    const shortUrl = await this.generateUniqueShortUrl()

    const expiresAt = creator.userId
      ? null
      : () => "CURRENT_TIMESTAMP + INTERVAL '1 day'"

    const newUrl = this.repo.create({
      originalUrl,
      shortUrl,
      userId: creator.userId,
      expiresAt
    })
    await this.repo.save(newUrl)
    await this.rateLimitService.createRecord(
      creator.userId ?? creator.ip ?? 'unknown',
      'create_url'
    )

    return this.toResponse(newUrl)
  }

  async redirectFromUrl(shortUrl: Url['shortUrl']): Promise<string> {
    const cache = await this.cacheManager.get(shortUrl)
    if (cache) return cache as unknown as string

    const url = await this.findByShortUrl(shortUrl)
    if (!url) throw new NotFoundException('Url not found')

    const dbTimestamp = await this.fetchCurrentTimestamp()
    if (url.expiresAt && url.expiresAt < dbTimestamp) {
      throw new NotFoundException('This URL has expired.')
    }

    await this.cacheManager.set(shortUrl, url.originalUrl)

    return url.originalUrl
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'fetch-database'
  })
  async fetchAllUrls() {
    return this.repo.find()
  }

  private async findByOriginalUrl(originalUrl: string) {
    return this.repo.findOne({ where: { originalUrl } })
  }

  private async findByShortUrl(shortUrl: string) {
    return this.repo.findOne({ where: { shortUrl } })
  }

  private async findById(id: string) {
    return this.repo.findOne({ where: { id } })
  }

  private async checkRateLimit(creator: CreatorInfo) {
    const isAllowed = await this.rateLimitService.isAllowed(
      creator.userId ?? creator.ip ?? 'unknown',
      creator.userId ? 20 : 5
    )

    if (!isAllowed) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS)
    }
  }

  private async updateExistingUrl(creator: CreatorInfo, existing: Url) {
    let needsUpdate = false

    if (!creator.userId && existing.expiresAt !== null) {
      existing.expiresAt = () => "CURRENT_TIMESTAMP + INTERVAL '1 day'"
      needsUpdate = true
    } else if (!existing.userId || existing.expiresAt !== null) {
      existing.expiresAt = null
      existing.userId = creator.userId
      needsUpdate = true
    }

    if (needsUpdate) {
      await this.repo.save(existing)
      await this.rateLimitService.createRecord(
        creator.userId ?? creator.ip ?? 'unknown',
        'create_url'
      )

      const updated = await this.findById(existing.id)
      if (!updated) {
        throw new NotFoundException('URL not found after update')
      }

      return this.toResponse(updated)
    }

    return this.toResponse(existing)
  }

  private toResponse(url: Url): UrlResponseDto {
    return {
      originalUrl: url.originalUrl,
      shortUrl: this.prepareShortUrl(url.shortUrl),
      expiresAt: url.expiresAt
    } as UrlResponseDto
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

  private async fetchCurrentTimestamp() {
    const date: { now: Date }[] = await this.repo.query(
      'SELECT CURRENT_TIMESTAMP as now'
    )
    return date[0].now
  }

  private prepareShortUrl(shortUrl: string) {
    const webUrl = this.configService.get<string>('WEBSITE_URL')
    if (!webUrl) return shortUrl

    return `${webUrl}/${shortUrl}`
  }
}
