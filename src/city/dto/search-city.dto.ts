import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SearchCityDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  City?: string;
}
