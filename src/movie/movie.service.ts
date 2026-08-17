import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Model, QueryFilter } from 'mongoose';
import { Movie } from './schemas/movie.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SearchMovieDto } from './dto/search-movie.dto';
import { pagination } from 'src/common/pagination/pagination.util';
import { MovieModule } from './movie.module';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    try {
      return await this.movieModel.create(createMovieDto);
    } catch (error: unknown) {
      const mongoError = error as { code?: number };

      if (mongoError.code === 11000) {
        throw new ConflictException('Movie with this title already exists');
      }

      throw error;
    }
  }

  async findAll(searchQuery: SearchMovieDto) {
    const { limit, page, query, ...restFilter } = searchQuery;
    const filter: QueryFilter<MovieModule> = {};

    if (query?.trim()) {
      const regex = new RegExp(query.trim(), 'i');
      filter.$or = [{ title: regex }];
    }

    for (const key in restFilter) {
      if (restFilter[key]) {
        filter[key] = restFilter[key];
      }
    }

    return pagination(this.movieModel, filter, {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
    });
  }

  async findOne(id: string) {
    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieModel.findByIdAndUpdate(
      id,
      {
        $set: updateMovieDto,
      },
      {
        runValidators: true,
        returnDocument: 'after',
      },
    );
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async remove(id: string) {
    const movie = await this.movieModel.findByIdAndDelete(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }
}
