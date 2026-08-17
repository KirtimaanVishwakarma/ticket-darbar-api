import { Module } from '@nestjs/common';
import { ScreenService } from './screen.service';
import { ScreenController } from './screen.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Screen, ScreenSchema } from './schemas/screen.schema';
import { TheatreModule } from 'src/theatre/theatre.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Screen.name, schema: ScreenSchema }]),
    TheatreModule,
  ],
  controllers: [ScreenController],
  providers: [ScreenService],
})
export class ScreenModule {}
