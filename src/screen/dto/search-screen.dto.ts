import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

export class SearchScreenDto extends PaginationDto {
  @IsOptional()
  @IsString()
  address!: string;
}
