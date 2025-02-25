import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramSchema } from './schema/program.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Program', schema: ProgramSchema }])
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule { }
