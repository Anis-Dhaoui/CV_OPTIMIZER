import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class PersonalInformationDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  portfolio?: string;
}

class SkillsDto {
  @IsArray()
  @IsString({ each: true })
  soft: string[];

  @IsArray()
  @IsString({ each: true })
  hard: string[];
}

class ExperienceDto {
  @IsString()
  title: string;

  @IsString()
  employer: string;

  @IsString()
  location: string;

  @IsString()
  dates: string;

  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];
}

class EducationDto {
  @IsString()
  degree: string;

  @IsString()
  institution: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  dates: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  details?: string[];
}

class LanguageDto {
  @IsString()
  language: string;

  @IsString()
  proficiency: string;
}







export class CreateResumeDto {
  @ValidateNested()
  @Type(() => PersonalInformationDto)
  personal_information: PersonalInformationDto;

  @IsString()
  summary: string;

  @ValidateNested()
  @Type(() => SkillsDto)
  skills: SkillsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  professional_experience: ExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education: EducationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  languages: LanguageDto[];
  
  @IsString()
  label: string;
}

