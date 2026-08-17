import { Module } from '@nestjs/common';
import { TheatreService } from './theatre.service';
import { TheatreController } from './theatre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Theatre, TheatreSchema } from './schemas/theatre.schema';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Theatre.name, schema: TheatreSchema }]),
    CityModule,
  ],
  controllers: [TheatreController],
  providers: [TheatreService],
  exports: [TheatreService],
})
export class TheatreModule {}
