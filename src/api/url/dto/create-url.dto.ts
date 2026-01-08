import { ApiProperty } from '@nestjs/swagger'
import { IsUrl } from 'class-validator'

export class CreateUrlDto {
  @IsUrl()
  @ApiProperty({
    example: 'https://github.com/TockePie'
  })
  url: string
}
