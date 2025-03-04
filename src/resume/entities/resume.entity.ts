import { Document } from 'mongoose';

export interface IResume extends Document {
  personal_information: {
    name: string;
    title: string;
    address: string;
    linkedin: string;
    phone: string;
    github: string;
    email: string;
    portfolio: string;
  };
  summary: string;
  skills: {
    soft: string[];
    hard: string[];
  };
  professional_experience: {
    title: string;
    employer: string;
    location: string;
    dates: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    dates: string;
    details: string[];
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
}