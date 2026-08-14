import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { UserRole, UserStatus } from '../schemas/user.schema';

export class SearchUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: UserStatus;

  @IsOptional()
  @IsString()
  role?: UserRole;
}
