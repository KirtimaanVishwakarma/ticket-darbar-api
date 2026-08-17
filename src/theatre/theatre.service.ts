import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { UpdateTheatreDto } from './dto/update-theatre.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Theatre, TheatreDocument } from './schemas/theatre.schema';
import { CityService } from 'src/city/city.service';
import { SearchTheatreDto } from './dto/search-theatre.dto';
import { PaginatedResponse } from 'src/common/pagination/pagination.interface';
import { pagination } from 'src/common/pagination/pagination.util';
import { TheatreModule } from './theatre.module';

@Injectable()
export class TheatreService {
  constructor(
    @InjectModel(Theatre.name) private readonly theatreModel: Model<Theatre>,
    private readonly cityService: CityService,
  ) {}

  async create(createTheatreDto: CreateTheatreDto): Promise<TheatreDocument> {
    await this.cityService.findOne(createTheatreDto.city);
    const theatre = await this.theatreModel.create(createTheatreDto);
    return theatre;
  }

  async findAll(
    searchQuery: SearchTheatreDto,
  ): Promise<PaginatedResponse<Theatre>> {
    const { limit, page, query, ...restFilter } = searchQuery;
    const filter: QueryFilter<TheatreModule> = {};

    if (query?.trim()) {
      const regex = new RegExp(query.trim(), 'i');

      filter.$or = [
        {
          name: regex,
        },
        {
          address: regex,
        },
      ];
    }

    for (const key in restFilter) {
      if (restFilter[key]) {
        filter[key] = restFilter[key];
      }
    }

    const populate = {
      path: 'city',
      select: 'name state',
    };

    return pagination(this.theatreModel, filter, {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
      populate,
    });
  }

  async findOne(id: string): Promise<TheatreDocument> {
    const theatre = await this.theatreModel.findById(id).populate('city');
    if (!theatre) {
      throw new NotFoundException('Theatre not found');
    }
    return theatre;
  }

  async update(
    id: string,
    updateTheatreDto: UpdateTheatreDto,
  ): Promise<TheatreDocument> {
    await this.findOne(id);
    const { name, address, city, mapUrl } = updateTheatreDto;
    if (!(name || address || city || mapUrl)) {
      throw new BadRequestException('Update body is required');
    }
    if (updateTheatreDto.city) {
      await this.cityService.findOne(updateTheatreDto.city);
    }

    const updatedTheatre = await this.theatreModel.findByIdAndUpdate(
      id,
      {
        $set: updateTheatreDto,
      },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );

    if (!updatedTheatre) {
      throw new NotFoundException('Theatre not found');
    }

    return updatedTheatre;
  }

  async remove(id: string): Promise<TheatreDocument> {
    const deletedTheatre = await this.theatreModel.findByIdAndDelete(id);
    if (!deletedTheatre) {
      throw new NotFoundException('Theatre not found');
    }

    return deletedTheatre;
  }
}
