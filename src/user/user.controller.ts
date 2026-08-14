import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDocument } from './schemas/user.schema';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('search')
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
