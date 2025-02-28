import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class ResumeService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,  // 'YOUR_OPENROUTER_API_KEY',  Replace with OpenRouter API Key 
      baseURL: 'https://openrouter.ai/api/v1',  // OpenRouter Base URL
    });
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
          { role: 'system', content: 'You are an AI that extracts structured data from resumes.' },
          { role: 'user', content: `Extract structured JSON data from this resume:\n${text}` }
        ],
        temperature: 0,
      });
      console.log(response.choices[0]?.message?.content.replace(/^```json\n/, '').replace(/\n```$/, ''))
      return response.choices[0]?.message?.content || 'No response from AI';
      
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw new Error('Failed to process resume.');
    }
  }
}
