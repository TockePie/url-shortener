import { IsDateString, IsOptional, IsUrl } from 'class-validator'

export class UrlResponseDto {
  @IsUrl()
  originalUrl: string

  @IsUrl()
  shortUrl: string

  @IsDateString()
  @IsOptional()
  expiresAt: Date | null
}
