import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema({
  timestamps: true,
  collection: 'city',
})
export class City {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    trim: true,
  })
  state!: string;
}

export const citySchema = SchemaFactory.createForClass(City);
