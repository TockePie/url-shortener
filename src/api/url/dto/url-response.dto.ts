import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsUrl } from 'class-validator'

export class UrlResponseDto {
  @IsUrl()
  @ApiProperty({
    example: 'https://github.com/TockePie'
  })
  originalUrl: string

  @IsUrl()
  @ApiProperty({
    example: 'https://shu-gamma.vercel.app/qxmC89z'
  })
  shortUrl: string

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2026-01-01 15:50:50.15',
    type: Date
  })
  expiresAt: Date | null
}
