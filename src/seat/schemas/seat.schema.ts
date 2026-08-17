import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { Screen } from 'src/screen/schemas/screen.schema';

export type SeatLayoutDocument = HydratedDocument<SeatLayout>;

export enum ColumnDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

export enum RowDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum SeatType {
  REGULAR = 'REGULAR',
  PREMIUM = 'PREMIUM',
  RECLINER = 'RECLINER',
  COUPLE = 'COUPLE',
}

// ----------------------------------
// Seat Row
// ----------------------------------

@Schema({
  _id: false,
})
export class SeatDetail {
  @Prop({
    required: true,
    trim: true,
  })
  row!: string;

  /**
   * Seat numbers after which an aisle appears.
   *
   * Example:
   * [5, 9]
   *
   * A1 A2 A3 A4 A5 | A6 A7 A8 A9 | A10 A11 A12
   */
  @Prop({
    type: [Number],
    default: [],
  })
  aisle!: number[];

  @Prop({
    required: true,
    min: 1,
  })
  totalSeats!: number;
}

export const SeatDetailSchema = SchemaFactory.createForClass(SeatDetail);

// ----------------------------------
// Seat Arrangement
// ----------------------------------

@Schema({
  _id: false,
})
export class SeatArrangement {
  @Prop({
    required: true,
    enum: SeatType,
  })
  seatType!: SeatType;

  @Prop({
    type: [SeatDetailSchema],
    default: [],
  })
  seatDetails!: SeatDetail[];
}

export const SeatArrangementSchema =
  SchemaFactory.createForClass(SeatArrangement);

// ----------------------------------
// Screen Layout
// ----------------------------------

@Schema({
  timestamps: true,
  collection: 'screen_layout',
})
export class SeatLayout {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Screen.name,
    unique: true,
    index: true,
  })
  screenId!: Types.ObjectId;

  @Prop({
    required: true,
    enum: ColumnDirection,
  })
  columnDirection!: ColumnDirection;

  @Prop({
    required: true,
    enum: RowDirection,
  })
  rowDirection!: RowDirection;

  @Prop({
    type: [SeatArrangementSchema],
    default: [],
  })
  seatArrangement!: SeatArrangement[];
}

export const SeatLayoutSchema = SchemaFactory.createForClass(SeatLayout);
