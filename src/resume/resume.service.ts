import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import mongoose, { Model } from 'mongoose';
import { IResume } from './entities/resume.entity';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/user/entities/user.entity';
import { Resume } from './schema/resume.schema';
import { User } from 'src/user/shcema/user.schema';

interface ATSReport {
  score: number;
  isATSFriendly: boolean;
  missingSections: string[];
  contentIssues: string[];
  suggestions: string[];
}

@Injectable()
export class ResumeService {
  private openai: OpenAI;

  constructor(
    @InjectModel(Resume.name) public resumeModel: Model<IResume>,
    @InjectModel(User.name) public userModel: Model<IUser>
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,  // 'YOUR_OPENROUTER_API_KEY',  Replace with OpenRouter API Key 
      baseURL: 'https://openrouter.ai/api/v1',  // OpenRouter Base URL
    });
  }

  // Define expected JSON format
  private getJsonFormat() {
    return {
      personal_information: {
        name: "",
        title: "",
        address: "",
        linkedin: "",
        phone: "",
        github: "",
        email: "",
        portfolio: ""
      },
      summary: "",
      skills: {
        soft: [],
        hard: [],
      },
      professional_experience: [
        {
          title: "",
          employer: "",
          location: "",
          dates: "",
          responsibilities: []
        }
      ],
      education: [
        {
          degree: "",
          institution: "",
          location: "",
          dates: "",
          details: []
        }
      ],
      languages: [
        {
          language: "",
          proficiency: ""
        }
      ]
    };
  }


  // Extract text from PDF
  async extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  // Send extracted text to AI for processing
  async parseResume(filePath: string, userId: any): Promise<any> {
    try {
      const text = await this.extractTextFromPDF(filePath);
      if (!text) {
        throw new Error('Failed to extract text from PDF');
      }

      const response = await this.openai.chat.completions.create({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `Extract structured resume data and strictly follow this JSON format: ${JSON.stringify(this.getJsonFormat(), null, 2)}. 
                      If links given as **text links** (e.g., "GitHub", "LinkedIn") without URLs, find their corresponding URLs.
                      Ensure that all detected links are included, even if they appear as plain text or at the end of the document.`
          },
          {
            role: 'user',
            content: `Extract structured JSON data from this resume:\n${text}`
          },
        ],
        temperature: 0.2,
      });

      const res = response.choices[0]?.message?.content.replace(/^```json\n/, '').replace(/\n```$/, '');

      const parsedData = JSON.parse(res);
      parsedData.userId = userId;

      const resume = await new this.resumeModel(parsedData).save();
      console.log(resume)

      // 2. Add resume _id to the user's resumes array
      await this.userModel.findByIdAndUpdate(
        userId,
        { $push: { resumes: resume._id } },
        { new: true, useFindAndModify: false },
      );

      return resume || 'No response from AI';

    } catch (error) {
      console.error('Error parsing resume:', error);
      throw new Error('Failed to process resume.');
    }
  }


  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ CHECK ATS FRIENLINESS $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$



  private checkResumeATSCompatibility(resume: IResume): ATSReport {
    const report: ATSReport = {
      score: 100,
      isATSFriendly: true,
      missingSections: [],
      contentIssues: [],
      suggestions: []
    };

    // Helper to deduct points and track issues
    const deduct = (points: number, issue: string, suggestion?: string) => {
      report.score -= points;
      report.contentIssues.push(issue);
      if (suggestion) report.suggestions.push(suggestion);
    };

    // 1. Required Sections Check (30%)
    const requiredSections = [
      'professional_experience',
      'education',
      'skills'
    ];

    requiredSections.forEach(section => {
      if (!resume[section as keyof IResume] ||
        (section === 'skills' && resume.skills.hard.length === 0)) {
        report.missingSections.push(section);
        deduct(10, `Missing or empty section: ${section}`);
      }
    });

    // 2. Contact Information Completeness (20%)
    const contactFields = [
      'name', 'email', 'phone', 'address'
    ];

    contactFields.forEach(field => {
      if (!resume.personal_information[field as keyof typeof resume.personal_information]?.trim()) {
        deduct(5, `Missing contact field: ${field}`, `Add ${field} to personal information`);
      }
    });

    const atsDateFormat = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} [–-] ((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}|Present)$/i;
    // 3. Professional Experience Validation (25%)
    resume.professional_experience.forEach((exp, index) => {
      if (!exp.title.trim()) {
        deduct(2, `Missing job title in position ${index + 1}`);
      }

      if (!exp.dates.match(atsDateFormat)) {
        deduct(3, `Invalid date format in position ${index + 1} on ${exp.title}`, `Use 'MM/YYYY - MM/YYYY' or similar ATS-friendly formats on ${exp.title}`);
      }

      if (exp.responsibilities.length < 3) {
        deduct(2, `Insufficient responsibilities in position ${index + 1} on ${exp.title}`, `Add at least 3 bullet points on ${exp.title}`);
      }
    });

    // 4. Education Validation (15%)
    resume.education.forEach(edu => {
      // if (!edu.degree.match(/BSc|BA|MSc|PhD/i)) {
      //   deduct(3, `Unclear degree title: ${edu.degree}`, "Use standard degree names");
      // }

      if (!edu.dates.match(atsDateFormat)) {
        deduct(2, `Invalid education dates: ${edu.dates} on ${edu.degree}`, `Use 'MMM YYYY – MMM YYYY' or 'MMM YYYY – Present' format on ${edu.degree}`);
      }
    });

    // 5. Skills Optimization Check (10%)
    if (resume.skills.hard.length < 5) {
      deduct(5, "Insufficient hard skills", "Include at least 5 technical skills");
    }

    if (resume.skills.soft.length > 3) {
      deduct(3, "Too many soft skills", "Limit to 3 key soft skills");
    }

    // Final score adjustment
    report.score = Math.max(0, Math.min(100, report.score));
    report.isATSFriendly = report.score >= 75;

    return report;
  }

  //   private calculateATSScore(resume: any): number {
  //     let score = 100;

  //     // Define required sections and their score impact
  //     const sectionWeights = {
  //         professional_experience: 30,
  //         skills: 20,
  //         education: 20,
  //         summary: 10,
  //         // projects: 10,
  //         // certifications: 10
  //     };

  //     let checkResult: any[];

  //     // Check if key sections exist
  //     for (const [section, weight] of Object.entries(sectionWeights)) {
  //       console.log(section)
  //       console.log(weight)
  //         if (!resume[section] || (Array.isArray(resume[section]) && resume[section].length === 0)) {
  //             score -= weight;
  //         }
  //     }

  //     // Word count validation (Minimum threshold: 500 words)
  //     // const totalWords = JSON.stringify(resume).split(/\s+/).length;
  //     // if (totalWords < 500) score -= 20;

  //     return Math.max(0, Math.min(score, 100)); // Keep score within 0-100 range
  // }


  async anylizeResume(label: string, userId: string): Promise<any> {
    const resume = await this.resumeModel.findOne({ label: label, userId: userId });
    if (!resume) {
      throw new Error('Resume not found');
    }

    // Calculate ATS Score
    const atsScore = this.checkResumeATSCompatibility(resume);
    return {
      atsScore,
      // atsFriendly: atsScore >= 70, // If score is 70% or higher, it's ATS-friendly
    };
  }
}