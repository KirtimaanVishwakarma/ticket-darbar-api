import { Model, QueryFilter } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City, CityDocument } from './schemas/city.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { pagination } from 'src/common/pagination/pagination.util';
import { CityModule } from './city.module';
import { PaginatedResponse } from 'src/common/pagination/pagination.interface';
import { SearchCityDto } from './dto/search-city.dto';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) {}
  async create(createCityDto: CreateCityDto) {
    const newCity = new this.cityModel(createCityDto);
    return await newCity.save();
  }

  async findAll(searchQuery: SearchCityDto): Promise<PaginatedResponse<City>> {
    const { limit, page, query, ...restFilter } = searchQuery;
    const filter: QueryFilter<CityModule> = {};

    if (query?.trim()) {
      const regex = new RegExp(query.trim(), 'i');
      filter.$or = [{ name: regex }, { state: regex }];
    }

    for (const key in restFilter) {
      if (restFilter[key]) {
        filter[key] = restFilter[key];
      }
    }

    return pagination(this.cityModel, filter, {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
    });
  }

  async findOne(id: string): Promise<CityDocument> {
    const city = await this.cityModel.findById(id);
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async update(
    id: string,
    updateCityDto: UpdateCityDto,
  ): Promise<CityDocument> {
    const { name, state } = updateCityDto;
    if (!(name || state)) {
      throw new BadRequestException(
        'At least one of name or state is required',
      );
    }
    const updatedCity = await this.cityModel.findByIdAndUpdate(
      id,
      {
        $set: updateCityDto,
      },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );

    if (!updatedCity) {
      throw new NotFoundException('City not found');
    }

    return updatedCity;
  }

  async remove(id: string) {
    const deletedCity = await this.cityModel.findByIdAndDelete(id);
    if (!deletedCity) {
      throw new NotFoundException('City not found');
    }

    return deletedCity;
  }
}
