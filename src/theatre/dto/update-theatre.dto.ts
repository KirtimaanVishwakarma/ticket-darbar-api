import { PartialType } from '@nestjs/swagger';
import { CreateTheatreDto } from './create-theatre.dto';
import { IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateTheatreDto extends PartialType(CreateTheatreDto) {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsMongoId()
  @IsNotEmpty()
  city!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsUrl()
  mapUrl!: string;
}
