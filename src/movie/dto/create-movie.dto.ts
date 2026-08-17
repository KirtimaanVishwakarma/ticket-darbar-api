import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsString()
  @IsNotEmpty()
  synopsis!: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  releaseDate!: Date;

  @IsNumber()
  durationMins!: number;

  @IsUrl()
  posterUrl!: string;

  @IsArray()
  @IsUrl({}, { each: true })
  trailerUrls!: string[];
}
