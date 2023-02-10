import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, Student } from '@prisma/client';
import { RequestQuery } from 'src/type';
import { StudentService } from './student.service';
import { Roles } from 'src/auth/rolesGuard/roles.decorator';
import { RolesGuard } from 'src/auth/rolesGuard/roles.guard';

@Controller('/student')
export class StudentController {
  constructor(private studentService: StudentService) {}
  
  @UseGuards(AuthGuard('jwtGuard'))
  @Get()
  getListStudent(@Query() query): Promise<Array<Omit<Student, 'passwordHashed'>>> {
    return this.studentService.getListStudent(query);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Get('count')
  getListStudentCount(): Promise<number> {
    return this.studentService.getListStudentCount();
  }

  @Get('params')
  getStudentByParams(): Promise<
    Array<Pick<Student, 'id' | 'firstName' | 'lastName' | 'identifierStudent'>>
  > {
    return this.studentService.getStudentByParams();
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Get(':id')
  getStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentService.getStudentById(id);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Post()
  addNewStudent(@Body() dto: Student) {
    return;
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  @Put('update')
  updateStudent(@Body() dto: Student) {
    return this.studentService.updateStudent(dto);
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwtGuard'), RolesGuard)
  @Delete(':id')
  deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
