import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeSchema } from './schema/resume.schema';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Resume', schema: ResumeSchema }]), // 3. Setup the mongoose module to use the Resume schema
      UserModule, // ✅ Import UserModule so UserModel is available
    ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
