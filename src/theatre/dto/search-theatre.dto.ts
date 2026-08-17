import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

export class SearchTheatreDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  address!: string;

  @IsMongoId()
  @IsOptional()
  city!: string;
}
