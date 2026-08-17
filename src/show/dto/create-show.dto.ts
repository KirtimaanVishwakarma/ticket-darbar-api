import { IsMilitaryTime, IsMongoId, IsNumber } from 'class-validator';

export class CreateShowDto {
  @IsMongoId()
  movieId!: string;

  @IsMongoId()
  screenId!: string;

  @IsMilitaryTime()
  startTime!: string;

  @IsNumber()
  basePrice!: number;
}
