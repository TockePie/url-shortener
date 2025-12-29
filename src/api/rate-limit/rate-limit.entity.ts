import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class RateLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  targetId: string

  @Column()
  endpoint: string

  @CreateDateColumn()
  createdAt: Date
}
