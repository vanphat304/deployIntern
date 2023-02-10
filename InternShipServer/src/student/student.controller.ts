import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Student } from '@prisma/client';
import { RequestQuery } from 'src/type';
import { StudentService } from './student.service';

@Controller('/student')
export class StudentController {
  constructor(private studentService: StudentService) {}
  // @UseGuards(AuthGuard('jwtGuard'))
  @Get()
  getListStudent(@Query() query): Promise<Array<Omit<Student, 'passwordHashed'>>> {
    return this.studentService.getListStudent(query);
  }
  @Get('params')
  getStudentByParams(): Promise<Array<Pick<Student, 'id' | 'firstName' | 'lastName'>>> {
    return this.studentService.getStudentByParams();
  }
  @Get(':id')
  getStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentService.getStudentById(id);
  }


  @Post()
  addNewStudent(@Body() dto: Student) {
    return;
  }

  @Put('update')
  updateStudent(@Body() dto: Student) {
    return this.studentService.updateStudent(dto);
  }
  @Delete(':id')
  deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
