import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import mongoose, { Model } from 'mongoose';
import { IResume } from './entities/resume.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ResumeService {
  private openai: OpenAI;

  constructor(@InjectModel('Resume') public resumeModel: Model<IResume>) {
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
  async parseResume(filePath: string): Promise<any> {
    try {
      const text = await this.extractTextFromPDF(filePath);
      if (!text) {
        throw new Error('Failed to extract text from PDF');
      }

      const response = await this.openai.chat.completions.create({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'system', content: `Extract structured resume data and strictly follow this JSON format: ${JSON.stringify(this.getJsonFormat(), null, 2)}` },
          { role: 'user', content: `Extract structured JSON data from this resume:\n${text}` },
        ],
        temperature: 0,
      });

      const res = response.choices[0]?.message?.content.replace(/^```json\n/, '').replace(/\n```$/, '');

      const parsedData = JSON.parse(res);
      await new this.resumeModel(parsedData).save();
      console.log(res)
      return res || 'No response from AI';

    } catch (error) {
      console.error('Error parsing resume:', error);
      throw new Error('Failed to process resume.');
    }
  }
}