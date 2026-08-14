import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class RefreshAccessTokenDto {
    @ApiProperty({
        example:"refresh-token",
        description: 'Valid refresh token',
    })
    @IsNotEmpty()
    refreshToken !: string
}