import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Personal Information Schema
class PersonalInformation {
  @Prop({ required: true })
  name: string;

  @Prop()
  title: string;

  @Prop()
  address: string;

  @Prop()
  linkedin: string;

  @Prop()
  phone: string;

  @Prop()
  github: string;

  @Prop()
  email: string;

  @Prop()
  portfolio: string;
}

// Skills Schema
class Skills {
  @Prop({ type: [String] })
  soft: string[];

  @Prop({ type: [String] })
  hard: string[];
}

// Professional Experience Schema
class ProfessionalExperience {
  @Prop()
  title: string;

  @Prop()
  employer: string;

  @Prop()
  location: string;

  @Prop()
  dates: string;

  @Prop({ type: [String] })
  responsibilities: string[];
}

// Education Schema
class Education {
  @Prop()
  degree: string;

  @Prop()
  institution: string;

  @Prop()
  location: string;

  @Prop()
  dates: string;

  @Prop({ type: [String], default: [] })
  details: string[];
}

// Languages Schema
class Language {
  @Prop()
  language: string;

  @Prop()
  proficiency: string;
}







@Schema()
export class Resume extends Document {
  @Prop({ type: PersonalInformation, required: true })
  personal_information: PersonalInformation;

  @Prop({ type: String })
  summary: string;

  @Prop({ type: Skills })
  skills: Skills;

  @Prop({ type: [ProfessionalExperience] })
  professional_experience: ProfessionalExperience[];

  @Prop({ type: [Education] })
  education: Education[];

  @Prop({ type: [Language] })
  languages: Language[];

  @Prop({ required: true })  
  userId: string; // Store user ID for reference
  @Prop({unique: true})
  label: string
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);


ResumeSchema.pre('save', function (next) {
  if (!this.label) {
    this.label = this.personal_information.title + "-" + this._id.toString().slice(-3);
  }
  next();
});