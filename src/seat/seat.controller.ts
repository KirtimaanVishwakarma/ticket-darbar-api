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
import { SeatService } from './seat.service';
import { CreateSeatLayoutDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/schemas/user.schema';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SearchSeatQuery } from './dto/searcg-seat.dto';

@Controller('api/v1/seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Seat created successfully')
  @Post()
  async create(@Body() createSeatDto: CreateSeatLayoutDto) {
    return await this.seatService.create(createSeatDto);
  }

  @Get('search')
  async findAll(@Query() searchQuery: SearchSeatQuery) {
    return await this.seatService.findAll(searchQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.seatService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Seat updated successfully')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return await this.seatService.update(id, updateSeatDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Seat deleted successfully')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.seatService.remove(id);
  }
}
