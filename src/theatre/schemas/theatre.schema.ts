import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { City } from 'src/city/schemas/city.schema';

export type TheatreDocument = HydratedDocument<Theatre>;

@Schema({
  timestamps: true,
  collection: 'theatre',
})
export class Theatre {
  @Prop({
    isRequired: true,
    trim: true,
  })
  name!: string;

  @Prop({
    isRequired: true,
    type: Types.ObjectId,
    ref: City.name,
  })
  city!: Types.ObjectId;

  @Prop({
    isRequired: true,
    trim: true,
  })
  address!: string;

  @Prop({
    isRequired: true,
  })
  mapUrl!: string;

  @Prop({
    default: true,
  })
  isActive!: true;
}

export const TheatreSchema = SchemaFactory.createForClass(Theatre);
