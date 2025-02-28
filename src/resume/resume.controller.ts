// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { ResumeService } from './resume.service';
// import { CreateResumeDto } from './dto/create-resume.dto';
// import { UpdateResumeDto } from './dto/update-resume.dto';


import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { diskStorage } from 'multer';
import { Express } from 'express';  // ✅ Import Express
import * as fs from 'fs';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService){
    // ✅ Ensure 'uploads' directory exists
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  }



  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './uploads' }),
    }),
  )



  async uploadResume(@UploadedFile() file: any) {  // ✅ No more TypeScript error
    if (!file) {
      return { error: 'No file uploaded' };
    }

    const parsedData = await this.resumeService.parseResume(file.path);
    // console.log(parsedData)
    return parsedData;
  }
}
