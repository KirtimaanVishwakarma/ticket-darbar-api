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
import { TheatreService } from './theatre.service';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { UpdateTheatreDto } from './dto/update-theatre.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/schemas/user.schema';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SearchTheatreDto } from './dto/search-theatre.dto';
import { Theatre, TheatreDocument } from './schemas/theatre.schema';
import { PaginatedResponse } from 'src/common/pagination/pagination.interface';

@Controller('api/v1/theatre')
export class TheatreController {
  constructor(private readonly theatreService: TheatreService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ResponseMessage('Theatre created successfully')
  async create(@Body() createTheatreDto: CreateTheatreDto) {
    return await this.theatreService.create(createTheatreDto);
  }

  @Get('search')
  async findAll(
    @Query() searchQuery: SearchTheatreDto,
  ): Promise<PaginatedResponse<Theatre>> {
    return await this.theatreService.findAll(searchQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TheatreDocument> {
    return await this.theatreService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ResponseMessage('Theatre updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updateTheatreDto: UpdateTheatreDto,
  ): Promise<TheatreDocument> {
    return await this.theatreService.update(id, updateTheatreDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ResponseMessage('Theatre deleted successfully')
  async remove(@Param('id') id: string): Promise<TheatreDocument> {
    return await this.theatreService.remove(id);
  }
}
