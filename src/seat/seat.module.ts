import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SeatLayout, SeatLayoutSchema } from './schemas/seat.schema';
import { ScreenModule } from 'src/screen/screen.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SeatLayout.name, schema: SeatLayoutSchema },
    ]),
    ScreenModule,
  ],
  controllers: [SeatController],
  providers: [SeatService],
})
export class SeatModule {}
