import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShowDocument = HydratedDocument<Show>;

@Schema({
  timestamps: true,
  collection: 'show',
})
export class Show {
  // @Prop({
  //     isRequired:true,
  //     type: Types.ObjectId,
  //     ref:
  // })
  movieId!: string;

  screenid!: string;

  startTime!: Date;

  basePrice!: number;
}

const ShowSchema = SchemaFactory.createForClass(Show);
