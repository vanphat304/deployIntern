import { Module } from '@nestjs/common';
import { ResultApplyJobController } from './result-apply-job.controller';
import { ResultApplyJobService } from './result-apply-job.service';

@Module({
  controllers: [ResultApplyJobController],
  providers: [ResultApplyJobService],
})
export class ResultApplyJobModule {}
