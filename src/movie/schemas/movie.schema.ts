import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({
  timestamps: true,
  collection: 'movie',
})
export class Movie {
  @Prop({
    isRequired: true,
    trim: true,
    unique: true,
  })
  title!: string;

  @Prop({
    isRequired: true,
    trim: true,
  })
  synopsis!: string;

  @Prop({
    isRequired: true,
  })
  releaseDate!: Date;

  @Prop({
    isRequired: true,
  })
  durationMins!: number;

  @Prop({
    isRequired: true,
  })
  posterUrl!: string;

  @Prop({
    isRequired: true,
    default: [],
  })
  trailerUrls!: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
