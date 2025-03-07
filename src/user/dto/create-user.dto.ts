import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { IResume } from "src/resume/entities/resume.entity";


export class CreateUserDto {
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

    @IsString()
    @MaxLength(25)
    @MinLength(4)
    @IsNotEmpty()
    readonly fullName: string;

    @IsString()
    @IsEmail()
    readonly email: string;

    @IsInt({message: "Mobile must be a number!"})
    @Min(10000000, {message: 'Mobile at least 8 digits long'})
    @Max(100000000000000, {message: 'Mobile at most 15 digits long'})
    readonly mobile: number;

    // @IsNotEmpty()
    readonly resumes?: IResume[];
}
