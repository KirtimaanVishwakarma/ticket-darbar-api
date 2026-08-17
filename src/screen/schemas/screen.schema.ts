import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Theatre } from 'src/theatre/schemas/theatre.schema';

export type ScreenDocument = HydratedDocument<Screen>;

@Schema({
  timestamps: true,
  collection: 'screen',
})
export class Screen {
  @Prop({
    isRequired: true,
    trim: true,
  })
  name!: string;

  @Prop({
    isRequired: true,
    type: Types.ObjectId,
    ref: Theatre.name,
  })
  theater!: Types.ObjectId;
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);
