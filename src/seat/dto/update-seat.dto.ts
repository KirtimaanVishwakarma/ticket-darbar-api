import { PartialType } from '@nestjs/swagger';
import { CreateSeatLayoutDto } from './create-seat.dto';

export class UpdateSeatDto extends PartialType(CreateSeatLayoutDto) {}
