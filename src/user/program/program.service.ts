import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProgram } from './entities/program.entity';

@Injectable()
export class ProgramService {
  constructor(@InjectModel('Program') public programModel: Model<IProgram>) { };

  async create(createProgramDto: CreateProgramDto): Promise<IProgram> {
    const newProgram = await new this.programModel(createProgramDto).save();
    return newProgram;
  }

  async findAll(): Promise<IProgram[]> {
    const programs = await this.programModel.find({}, ['-__v']);
    if (!programs || programs.length == 0) {
      throw new NotFoundException('No data found!')
    }
    return programs;
  }

  async findOne(id: string) {
    return `This action returns a #${id} program`;
  }

  async update(id: string, updateProgramDto: UpdateProgramDto): Promise<IProgram> {
    const program = await this.programModel.findByIdAndUpdate(id, updateProgramDto, { new: true });
    if (!program) {
      throw new NotFoundException(`Program #${id} not found!`)
    }
    return program;
  }

  async remove(id: string): Promise<IProgram> {
    const deletedProgram = await this.programModel.findByIdAndDelete(id);
    if (!deletedProgram) {
      throw new NotFoundException(`Program #${id} not found!`)
    }
    return deletedProgram;
  }
}
