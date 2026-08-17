import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Show, ShowSchema } from './schemas/show.schema';
import { MovieModule } from 'src/movie/movie.module';
import { ScreenModule } from 'src/screen/screen.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Show.name, schema: ShowSchema }]),
    MovieModule,
    ScreenModule,
  ],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
