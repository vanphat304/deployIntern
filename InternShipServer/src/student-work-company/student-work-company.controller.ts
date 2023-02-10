import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StudentWorkCompany } from '@prisma/client';
import { StudentWorkCompanyService } from './student-work-company.service';

@Controller('student-work-company')
export class StudentWorkCompanyController {
  constructor(private StudentWorkCompanyService: StudentWorkCompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addCompany(@Body() dto: StudentWorkCompany): Promise<StudentWorkCompany> {
    return this.StudentWorkCompanyService.addStudentWorkCompany(dto);
  }
  @Get()
  getListStudentWorkCompany(): Promise<StudentWorkCompany[]> {
    return this.StudentWorkCompanyService.getListStudentWorkCompany();
  }
  @Get(':id')
  getStudentWorkCompanyById(@Param('id') id: string): Promise<StudentWorkCompany> {
    return this.StudentWorkCompanyService.getStudentWorkCompanyById(id);
  }
  @Put('update')
  updateStudentWorkCompany(@Body() dto: StudentWorkCompany) {
    return this.StudentWorkCompanyService.updateStudentWorkCompany(dto);
  }
  @Delete(':id')
  deleteStudentWorkCompany(@Param('id') id: string) {
    return this.StudentWorkCompanyService.deleteStudentWorkCompany(id);
  }
}
