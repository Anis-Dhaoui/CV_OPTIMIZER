import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) { }

  @Post('/add')
  async create(@Res() res, @Body() createProgramDto: CreateProgramDto) {
    try {
      const createdProgram = await this.programService.create(createProgramDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: 200,
        message: 'Program creaated successfully',
        createdProgram: createdProgram
      });
    } catch (error) {
      if (error && error.keyPattern.programName == 1) {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          message: `Program "${error.keyValue.programName}" is already exist`
        })
      }
      return res.status(error.status).json(error.response);
    }
  }

  @Get('/fetch')
  async findAll() {
    return this.programService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.programService.findOne(id);
  // }

  @Put('/edit/:id')
  async update(@Res() res, @Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
    try {
      const updatedProgram = await this.programService.update(id, updateProgramDto);
      return res.status(HttpStatus.OK).json({
        message: 'Program updated',
        updatedProgram,
      });
    } catch (err) {
      if (err.name == 'CastError') {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          error: 'Not Found'
        });
      }
      if (err && err.keyPattern.programName == 1) {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          message: `Program: "${err.keyValue.programName}" is already exist`,
        })
      }
      return res.status(err.status).json(err.response);
    }
  }

  @Delete('/remove/:id')
  async remove(@Res() res, @Param('id') id: string) {
    try {
      const deletedProgram = await this.programService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Program deleted',
        deletedProgram,
      });
    } catch (err) {
      if (err.rightName == 'CastError') {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          error: 'Not Found'
        });
      }
      return res.status(err.status).json(err.response);
    }
  }
}
