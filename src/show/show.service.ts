import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Show } from './schemas/show.schema';
import { Model, QueryFilter } from 'mongoose';
import { SearcgShowDto } from './dto/search-show.dto';
import { ShowModule } from './show.module';
import { pagination } from 'src/common/pagination/pagination.util';
import { PaginatedResponse } from 'src/common/pagination/pagination.interface';
import { MovieService } from 'src/movie/movie.service';
import { ScreenService } from 'src/screen/screen.service';

@Injectable()
export class ShowService {
  constructor(
    @InjectModel(Show.name) private readonly showModel: Model<Show>,
    private readonly movieService: MovieService,
    private readonly screenService: ScreenService,
  ) {}

  async create(createShowDto: CreateShowDto) {
    return await this.showModel.create(createShowDto);
  }

  async findAll(searchQuery: SearcgShowDto): Promise<PaginatedResponse<Show>> {
    const { limit, page, query, ...restFilter } = searchQuery;
    const filter: QueryFilter<ShowModule> = {};

    for (const key in restFilter) {
      if (restFilter[key]) {
        filter[key] = restFilter[key];
      }
    }

    const populate = [
      {
        path: 'movieId',
        select: 'title posterUrl releaseDate durationMins',
      },
      {
        path: 'screenId',
        select: 'name',
      },
    ];

    return pagination(this.showModel, filter, {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
      populate,
    });
  }

  async findOne(id: string) {
    const show = await this.showModel.findById(id).populate('movieId screenId');
    if (!show) {
      throw new NotFoundException('Show not found');
    }
    return show;
  }

  async update(id: string, updateShowDto: UpdateShowDto) {
    if (updateShowDto.movieId) {
      await this.movieService.findOne(updateShowDto.movieId);
    }
    if (updateShowDto.screenId) {
      await this.screenService.findOne(updateShowDto.screenId);
    }
    const show = await this.showModel.findByIdAndUpdate(
      id,
      {
        $set: updateShowDto,
      },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
    if (!show) {
      throw new NotFoundException('Show not found');
    }
    return show;
  }

  async remove(id: string) {
    const show = await this.showModel.findByIdAndDelete(id);
    if (!show) {
      throw new NotFoundException('Show not found');
    }
    return show;
  }
}
