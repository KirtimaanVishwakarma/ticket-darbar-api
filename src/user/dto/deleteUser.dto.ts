import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class UserIdDto {
    @ApiProperty()
    @IsMongoId()
    userId!: string
}