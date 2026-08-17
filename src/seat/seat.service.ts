import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatLayoutDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SeatLayout } from './schemas/seat.schema';
import { Model, QueryFilter } from 'mongoose';
import { ScreenService } from 'src/screen/screen.service';
import { pagination } from 'src/common/pagination/pagination.util';
import { SeatModule } from './seat.module';
import { SearchSeatQuery } from './dto/searcg-seat.dto';

@Injectable()
export class SeatService {
  constructor(
    @InjectModel(SeatLayout.name) private seatLayoutModel: Model<SeatLayout>,

    private readonly screenService: ScreenService,
  ) {}

  async create(createSeatDto: CreateSeatLayoutDto) {
    await this.screenService.findOne(createSeatDto.screenId);
    return await this.seatLayoutModel.create(createSeatDto);
  }

  async findAll(searchQuery: SearchSeatQuery) {
    const { limit, page, query, ...restFilter } = searchQuery;
    const filter: QueryFilter<SeatModule> = {};

    for (const key in restFilter) {
      if (restFilter[key]) {
        filter[key] = restFilter[key];
      }
    }

    const populate = {
      path: 'screenId',
      select: 'name',
    };

    return pagination(this.seatLayoutModel, filter, {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
      populate,
    });
  }

  async findOne(id: string) {
    const seat = await this.seatLayoutModel.findById(id);
    if (!seat) {
      throw new NotFoundException('Seat not found');
    }
    return seat;
  }

  async update(id: string, updateSeatDto: UpdateSeatDto) {
    if (updateSeatDto.screenId) {
      await this.screenService.findOne(updateSeatDto.screenId);
    }
    const seat = await this.seatLayoutModel.findByIdAndUpdate(
      id,
      {
        $set: updateSeatDto,
      },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
    return seat;
  }

  async remove(id: string) {
    const seat = await this.seatLayoutModel.findByIdAndDelete(id);
    if (!seat) {
      throw new NotFoundException('Seat not found');
    }
    return seat;
  }
}
