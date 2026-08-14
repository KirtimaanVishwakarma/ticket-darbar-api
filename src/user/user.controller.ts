import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserDocument, UserRole } from './schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Get('search')
  @Roles(UserRole.CUSTOMER)
  async getAllUsers(@Query() query: SearchUsersDto) {
    return await this.userService.searchUserList(query);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: {user: any}): Promise<UserDocument | null> {
    const userId = req.user.sub;
    return await this.userService.findUserById(userId)
  }
}
