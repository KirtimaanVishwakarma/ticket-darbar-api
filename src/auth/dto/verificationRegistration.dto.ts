import { IsNotEmpty } from "class-validator";

export class VerificationRegistrationDto {
    @IsNotEmpty()
    token!: string
}