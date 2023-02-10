import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { JobdescriptionModule } from './jobdescription/jobdescription.module';
import { StudentApplyJobsModule } from './student-apply-jobs/student-apply-jobs.module';
import { UploadfileModule } from './uploadfile/uploadfile.module';
import { ResultApplyJobModule } from './result-apply-job/result-apply-job.module';
import { StudentProposalModule } from './student-proposal/student-proposal.module';
import { StudentWorkCompanyModule } from './student-work-company/student-work-company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StudentModule,
    AuthModule,
    CompanyModule,
    JobdescriptionModule,
    StudentApplyJobsModule,
    UploadfileModule,
    ResultApplyJobModule,
    StudentProposalModule,
    StudentWorkCompanyModule,
  ],
})
export class AppModule {}
