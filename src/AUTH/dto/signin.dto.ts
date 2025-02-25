import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";


export class SigninDto {
    @IsString()
    @MaxLength(10)
    @MinLength(4)
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @MaxLength(25)
    @MinLength(4)
    @IsNotEmpty()
    readonly password: string;
}
