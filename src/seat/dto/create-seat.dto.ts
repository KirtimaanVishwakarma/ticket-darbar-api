import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  ColumnDirection,
  RowDirection,
  SeatType,
} from '../schemas/seat.schema';

export class SeatDetailDto {
  @IsNotEmpty()
  @IsString()
  row!: string;

  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  aisle!: number[];

  @IsInt()
  @Min(1)
  totalSeats!: number;
}

export class SeatArrangementDto {
  @IsNotEmpty()
  @IsEnum(SeatType)
  seatType!: SeatType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDetailDto)
  seatDetails!: SeatDetailDto[];
}

export class CreateSeatLayoutDto {
  @IsNotEmpty()
  @IsString()
  screenId!: string;

  @IsNotEmpty()
  @IsEnum(ColumnDirection)
  columnDirection!: ColumnDirection;

  @IsNotEmpty()
  @IsEnum(RowDirection)
  rowDirection!: RowDirection;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatArrangementDto)
  seatArrangement!: SeatArrangementDto[];
}
