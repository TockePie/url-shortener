import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @ApiProperty({
    minLength: 8,
    maxLength: 16
  })
  password: string
}
