import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

export class SearchMovieDto extends PaginationDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releaseDate!: Date;
}
