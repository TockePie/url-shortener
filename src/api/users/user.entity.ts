import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Url } from '../url/url.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[]
}
