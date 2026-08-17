import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ScreenService } from './screen.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/schemas/user.schema';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SearchScreenDto } from './dto/search-screen.dto';
import { ScreenDocument } from './schemas/screen.schema';

@Controller('api/v1/screen')
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Screen created successfully')
  @Post()
  async create(
    @Body() createScreenDto: CreateScreenDto,
  ): Promise<ScreenDocument> {
    return await this.screenService.create(createScreenDto);
  }

  @Get('search')
  async findAll(@Query() searchQuery: SearchScreenDto) {
    return await this.screenService.findAll(searchQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ScreenDocument> {
    return await this.screenService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Screen updated successfully')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScreenDto: UpdateScreenDto,
  ): Promise<ScreenDocument> {
    return await this.screenService.update(id, updateScreenDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Screen deleted successfully')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<ScreenDocument> {
    return this.screenService.remove(id);
  }
}
