import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MoreThan, Repository } from 'typeorm'

import { RateLimit } from './rate-limit.entity'

@Injectable()
export class RateLimitService {
  constructor(
    @InjectRepository(RateLimit) private repo: Repository<RateLimit>
  ) {}

  async isAllowed(targetId: string, limit: number, endpoint: string) {
    const currentTime = new Date()
    const lastHour = new Date(currentTime.getTime() - 60 * 60 * 1000)

    const count = await this.repo.count({
      where: {
        targetId,
        createdAt: MoreThan(lastHour)
      }
    })

    if (count > limit) {
      return false
    }

    await this.repo.save({ targetId, endpoint })
    return true
  }
}
