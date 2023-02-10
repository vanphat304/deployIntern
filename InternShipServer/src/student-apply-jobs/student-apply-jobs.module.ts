import { Module } from '@nestjs/common';
import { StudentApplyJobsController } from './student-apply-jobs.controller';
import { StudentApplyJobsService } from './student-apply-jobs.service';

@Module({
  controllers: [StudentApplyJobsController],
  providers: [StudentApplyJobsService],
})
export class StudentApplyJobsModule {}
