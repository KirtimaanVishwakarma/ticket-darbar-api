import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateScreenDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsMongoId()
  theater!: string;
}
