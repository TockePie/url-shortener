import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { QueryFailedError, Repository } from 'typeorm'

import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOne(username: string) {
    return this.repo.findOne({ where: { username } })
  }

  async create(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.repo.create({ username, password: hashedPassword })

    try {
      return await this.repo.save(user)
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const driverError = err.driverError as { code?: string }

        if (driverError.code === 'SQLITE_CONSTRAINT') {
          throw new ConflictException('This username is already taken.')
        }
      }

      throw err
    }
  }
}
