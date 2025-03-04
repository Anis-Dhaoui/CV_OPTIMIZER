import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeSchema } from './schema/resume.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Resume', schema: ResumeSchema }]), // 3. Setup the mongoose module to use the Resume schema
    ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
