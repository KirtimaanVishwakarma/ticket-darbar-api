import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { UserRole, UserStatus } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class SearchUsersDto extends PaginationDto {
  @ApiProperty({
    enum: UserStatus,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: UserStatus;

  @ApiProperty({
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: UserRole;
}
