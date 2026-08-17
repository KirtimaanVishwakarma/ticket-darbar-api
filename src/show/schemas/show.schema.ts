import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Movie } from 'src/movie/schemas/movie.schema';
import { Screen } from 'src/screen/schemas/screen.schema';

export type ShowDocument = HydratedDocument<Show>;

@Schema({
  timestamps: true,
  collection: 'show',
})
export class Show {
  @Prop({
    isRequired: true,
    type: Types.ObjectId,
    ref: Movie.name,
  })
  movieId!: string;

  @Prop({
    isRequired: true,
    type: Types.ObjectId,
    ref: Screen.name,
  })
  screenId!: string;

  @Prop({
    isRequired: true,
  })
  startTime!: string;

  @Prop({
    isRequired: true,
  })
  basePrice!: number;
}

export const ShowSchema = SchemaFactory.createForClass(Show);
