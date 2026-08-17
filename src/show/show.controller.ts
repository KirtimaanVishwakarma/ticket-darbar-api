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
import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SearcgShowDto } from './dto/search-show.dto';

@Controller('api/v1/show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ResponseMessage('Show created successfully')
  async create(@Body() createShowDto: CreateShowDto) {
    return await this.showService.create(createShowDto);
  }

  @Get('search')
  async findAll(@Query() searchQuery: SearcgShowDto) {
    return await this.showService.findAll(searchQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.showService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ResponseMessage('Show updated successfully')
  async update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto) {
    return await this.showService.update(id, updateShowDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ResponseMessage('Show deleted successfully')
  async remove(@Param('id') id: string) {
    return await this.showService.remove(id);
  }
}
