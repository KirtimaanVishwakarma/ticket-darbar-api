import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Screen, ScreenDocument } from './schemas/screen.schema';
import { Model, QueryFilter } from 'mongoose';
import { TheatreService } from 'src/theatre/theatre.service';
import { pagination } from 'src/common/pagination/pagination.util';
import { PaginatedResponse } from 'src/common/pagination/pagination.interface';
import { ScreenModule } from './screen.module';
import { SearchScreenDto } from './dto/search-screen.dto';

@Injectable()
export class ScreenService {
  constructor(
    @InjectModel(Screen.name) private screenModel: Model<Screen>,
    private readonly theatreService: TheatreService,
  ) {}

  async create(createScreenDto: CreateScreenDto): Promise<ScreenDocument> {
    await this.theatreService.findOne(createScreenDto.theater);
    return await this.screenModel.create(createScreenDto);
  }

  async findAll(
    searchQuery: SearchScreenDto,
  ): Promise<PaginatedResponse<Screen>> {
    const { limit, page, query, ...restFilter } = searchQuery;
    const filter: QueryFilter<ScreenModule> = {};

    if (query?.trim()) {
      const regex = new RegExp(query.trim(), 'i');

      filter.$or = [
        {
          name: regex,
        },
      ];
    }

    for (const key in restFilter) {
      if (restFilter[key]) {
        filter[key] = restFilter[key];
      }
    }

    const populate = {
      path: 'theater',
      select: 'name state',
    };

    return pagination(this.screenModel, filter, {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
      populate,
    });
  }

  async findOne(id: string) {
    const screen = await this.screenModel.findById(id).populate('theater');
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }

  async update(
    id: string,
    updateScreenDto: UpdateScreenDto,
  ): Promise<ScreenDocument> {
    const { name, theater } = updateScreenDto;
    if (!(name || theater)) {
      throw new BadRequestException('Screen body is required');
    }

    if (theater) {
      await this.theatreService.findOne(theater);
    }

    const screen = await this.screenModel.findByIdAndUpdate(
      id,
      {
        $set: updateScreenDto,
      },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }

  async remove(id: string): Promise<ScreenDocument> {
    const deletedScreen = await this.screenModel.findByIdAndDelete(id);
    if (!deletedScreen) {
      throw new NotFoundException('Screen not found');
    }

    return deletedScreen;
  }
}
