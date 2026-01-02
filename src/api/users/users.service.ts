import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private configService: ConfigService
  ) {}

  async findOne(username: string) {
    return this.repo.findOne({ where: { username } })
  }

  async create(username: string, password: string) {
    const bcryptRounds = this.configService.get<number>('BCRYPT_HASH_ROUNDS')!
    const hashedPassword = await bcrypt.hash(password, bcryptRounds)

    const user = this.repo.create({ username, password: hashedPassword })
    return await this.repo.save(user)
  }
}
