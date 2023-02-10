import { Module } from '@nestjs/common';
import { StudentWorkCompanyService } from './student-work-company.service';
import { StudentWorkCompanyController } from './student-work-company.controller';

@Module({
  providers: [StudentWorkCompanyService],
  controllers: [StudentWorkCompanyController],
})
export class StudentWorkCompanyModule {}
