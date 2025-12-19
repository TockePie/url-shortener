import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  originalUrl: string

  @Column({ unique: true })
  shortUrl: string

  @CreateDateColumn()
  createdAt: Date
}
