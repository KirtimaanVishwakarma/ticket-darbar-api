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
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/schemas/user.schema';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SearchMovieDto } from './dto/search-movie.dto';

@Controller('api/v1/movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ResponseMessage('Movie created successfully')
  async create(@Body() createMovieDto: CreateMovieDto) {
    return await this.movieService.create(createMovieDto);
  }

  @Get('search')
  async findAll(@Query() searchQuery: SearchMovieDto) {
    return await this.movieService.findAll(searchQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.movieService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ResponseMessage('Movie updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return await this.movieService.update(id, updateMovieDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ResponseMessage('Movie deleted successfully')
  async remove(@Param('id') id: string) {
    return await this.movieService.remove(id);
  }
}
