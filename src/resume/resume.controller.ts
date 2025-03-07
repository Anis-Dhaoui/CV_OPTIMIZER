import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { diskStorage } from 'multer';
import { Express } from 'express';  // ✅ Import Express
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/AUTH/guards/jwt-auth.guard';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {
    // ✅ Ensure 'uploads' directory exists
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './uploads' })
    })
  )



  async uploadResume(@UploadedFile() file: any, @Req() req: any) {  // ✅ No more TypeScript error
    console.log(req.user._id)
    if (!file) {
      return { error: 'No file uploaded' };
    }

    const parsedData = await this.resumeService.parseResume(file.path, req.user._id);
    // console.log(parsedData)
    return parsedData;
  }
}
