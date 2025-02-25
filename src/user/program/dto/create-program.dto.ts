import { IsString, IsNotEmpty, MaxLength, MinLength } from "@nestjs/class-validator";

export class CreateProgramDto {
    @IsString()
    @MaxLength(20)
    @MinLength(2)
    @IsNotEmpty()
    readonly programName: string;
}
