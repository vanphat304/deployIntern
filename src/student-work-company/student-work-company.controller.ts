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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role, StudentWorkCompany } from '@prisma/client';
import { StudentWorkCompanyService } from './student-work-company.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/rolesGuard/roles.decorator';

@Controller('student-work-company')
export class StudentWorkCompanyController {
  constructor(private StudentWorkCompanyService: StudentWorkCompanyService) {}

  @UseGuards(AuthGuard('jwtGuard'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addStudentWorkCompany(@Body() dto): Promise<StudentWorkCompany> {
    const {idJobApply , ...studentWork} = dto;
    return this.StudentWorkCompanyService.addStudentWorkCompany(idJobApply , studentWork);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Get()
  getListStudentWorkCompany( @Query() query): Promise<StudentWorkCompany[]> {
    return this.StudentWorkCompanyService.getListStudentWorkCompany(query);
  }

  @UseGuards(AuthGuard('jwtGuard'))
  @Get('/count')
  getListStudentWorkCompanyRecords( @Query() query): Promise<number> {
    return this.StudentWorkCompanyService.getTotalRecord();
  }

  @UseGuards(AuthGuard('jwtGuard'))
  @Get(':id')
  getStudentWorkCompanyById(@Param('id') id: string): Promise<StudentWorkCompany> {
    return this.StudentWorkCompanyService.getStudentWorkCompanyById(id);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Put('update')
  updateStudentWorkCompany(@Body() dto: StudentWorkCompany) {
    return this.StudentWorkCompanyService.updateStudentWorkCompany(dto);
  }
  @UseGuards(AuthGuard('jwtGuard'))
  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteStudentWorkCompany(@Param('id') id: string) {
    return this.StudentWorkCompanyService.deleteStudentWorkCompany(id);
  }
}
