import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { User } from '../users/user.entity'

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.urls)
  user: User

  @Column({ unique: true })
  originalUrl: string

  @Column({ unique: true })
  shortUrl: string

  @CreateDateColumn()
  createdAt: Date
}
