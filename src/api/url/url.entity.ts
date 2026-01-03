import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { User } from '../users/user.entity'

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.urls)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ nullable: true })
  userId: string | null

  @Column({ unique: true })
  originalUrl: string

  @Column({ unique: true })
  shortUrl: string

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null

  @CreateDateColumn()
  createdAt: Date
}
