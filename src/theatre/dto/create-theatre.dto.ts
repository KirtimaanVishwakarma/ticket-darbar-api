import { IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateTheatreDto {
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
