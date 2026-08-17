import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerificationRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  token!: string;
}
