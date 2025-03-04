import { Schema } from 'mongoose';
import { IResume } from '../entities/resume.entity';

export const ResumeSchema = new Schema<IResume>({
    personal_information: {
      name: { type: String},
      title: { type: String},
      address: { type: String},
      linkedin: { type: String},
      phone: { type: String},
      github: { type: String},
      email: { type: String},
      portfolio: { type: String},
    },
    summary: { type: String},
    skills: {
      soft: { type: [String]},
      hard: { type: [String]},
    },
    professional_experience: [
      {
        title: { type: String},
        employer: { type: String},
        location: { type: String},
        dates: { type: String},
        responsibilities: { type: [String]},
      },
    ],
    education: [
      {
        degree: { type: String},
        institution: { type: String},
        location: { type: String},
        dates: { type: String},
        details: { type: [String], default: [] },
      },
    ],
    languages: [
      {
        language: { type: String},
        proficiency: { type: String},
      },
    ],
  });